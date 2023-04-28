use itertools::Itertools;
use std::collections::HashMap;
use std::fs::File;
use std::path::PathBuf;

use clap::ArgAction::SetTrue;
use clap::{value_parser, Arg, ArgMatches, Command, ValueHint};
use futures_util::pin_mut;
use futures_util::stream::StreamExt;
use indicatif::{ProgressBar, ProgressStyle};
use log::error;
use tool_aidbox::BoxClient;
use tool_config::read_exclude_config;
use tool_generator::cache::Cache;
use tool_generator::common::{deep_merge_element_schema, Element};
use tool_generator::reader::read_schema;
use tool_generator::types::typescript::{write_typescript_types, WriterConfig};

pub fn commands() -> Command {
  Command::new("types").about("Types generating").args(vec![
    Arg::new("exclude")
      .long("exclude")
      .help("Exclude config. Should follow structure\n{\n \"ns\": [],\n \"symbols\": [],\n \"tags\": []\n}")
      .value_hint(ValueHint::FilePath),
    Arg::new("profile")
      .long("profile")
      .help("Provide profile url"),
    Arg::new("output")
      .long("output")
      .value_hint(ValueHint::FilePath)
      .required(true)
      .help("Output file"),
    Arg::new("target")
      .long("target")
      .help("Target programming language")
      .value_parser(["typescript"])
      .default_value("typescript"),
    Arg::new("fhir").long("fhir").help("FHIR related type"),
    Arg::new("max-values").long("max-values").help("Maximum count for values in type like status in Encounter")
        .default_value("10").value_parser(value_parser!(usize)),
    Arg::new("collapse-values").long("collapse-values")
        .action(SetTrue).help("Collapse big values just into `string`")
  ])
}
#[allow(clippy::too_many_lines)]
pub async fn generate(
  sub_matches: &ArgMatches,
  instance: BoxClient,
  instance_tag: &str,
) -> Result<(), String> {
  let output = sub_matches.get_one::<String>("output").unwrap();

  if let Err(e) = File::create(PathBuf::from(output.clone())) {
    return Err(format!(
      "Error with check output path: {}. Error: {}",
      output, e
    ));
  };

  let exclude_config = read_exclude_config(sub_matches.get_one::<String>("exclude")).unwrap();
  let include_profile = sub_matches.get_one::<String>("profile");
  let cache_init = Cache::default(instance_tag);
  let collapse = sub_matches.get_one::<bool>("collapse-values").unwrap();
  let max_values = sub_matches.get_one::<usize>("max-values").unwrap();

  let mut cache = match cache_init {
    Err(err) => return Err(err),
    Ok(it) => it,
  };

  cache.restore();

  let symbols = match instance
    .load_all_symbols(cache.cache_path.clone(), &exclude_config)
    .await
  {
    Ok(it) => it,
    Err(e) => return Err(e.to_string()),
  };

  log::info!("Start processing {} symbols", symbols.len());

  let pb = ProgressBar::new(symbols.len() as u64);
  pb.set_style(
    ProgressStyle::with_template("{spinner:.cyan} [{bar:50.cyan/white}] {pos}/{len} {msg}")
      .unwrap()
      .progress_chars("=>-"),
  );
  let mut result: HashMap<String, Element> = HashMap::new();

  let pb_for_logger = pb.clone();

  let log_handler = Box::leak(Box::new(move |message: String| {
    pb_for_logger.clone().println(message);
  }));

  {
    let types = read_schema(
      symbols.clone(),
      instance,
      &mut cache,
      include_profile.cloned(),
      exclude_config,
      log_handler,
    )
    .await;

    pin_mut!(types);

    while let Some(res) = types.next().await {
      let new_element = res.element;
      let new_element_name = res.name;
      match result.get(new_element_name.as_str()) {
        Some(old_element) => {
          let merged_types = match new_element.clone().schema {
            Some(el) => match old_element.clone().schema {
              Some(old) => Some(deep_merge_element_schema(old, el)),
              None => Some(el),
            },
            None => old_element.schema.clone(),
          };
          result.insert(
            new_element_name,
            Element {
              is_rpc: new_element.is_rpc,
              rpc_method: new_element.rpc_method,
              description: new_element.description.clone(),
              profile: new_element.profile,
              extends: match old_element.extends.clone() {
                Some(it) => match new_element.extends.clone() {
                  Some(ri) => {
                    let extends: Vec<_> = [it.as_slice(), ri.as_slice()]
                      .concat()
                      .iter()
                      .unique()
                      .map(String::to_string)
                      .collect();

                    Some(extends)
                  },
                  None => old_element.extends.clone(),
                },
                None => old_element.extends.clone(),
              },
              values: old_element.values.clone(),
              plain: old_element.plain.clone(),
              schema: merged_types,
            },
          );
        },
        None => {
          result.insert(new_element_name, new_element);
        },
      }
      pb.inc(1);
      pb.set_message(format!("{} symbol processed", res.symbol));
    }
  }
  pb.finish_with_message(format!(
    "{:#?} of {:#?} symbols processed in {:?}",
    result.len(),
    symbols.len(),
    (pb.elapsed().as_secs_f64() * 100f64).floor() / 100f64
  ));

  match cache.save_types_schema(&result) {
    Ok(..) | Err(..) => {},
  }
  match cache.save() {
    Ok(..) | Err(..) => {},
  }

  let fhir = sub_matches.contains_id("fhir");

  match sub_matches.get_one::<String>("target").unwrap().as_str() {
    "typescript" => write_typescript_types(
      result,
      WriterConfig {
        fhir,
        output: output.clone(),
        max_values: max_values.to_owned(),
        collapse_values: collapse.to_owned(),
      },
    ),
    unknown => {
      error!("Unknown target {}", unknown);
    },
  };
  Ok(())
}
