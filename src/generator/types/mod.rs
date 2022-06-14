mod typescript;

use std::{path::PathBuf, process::exit};

use crate::generator::helpers::warm_up_definitions;
use crate::generator::types::typescript::write_typescript_types;
use clap::{Arg, ArgMatches, Command, ValueHint};
use log::error;

use crate::r#box::requests::BoxClient;

pub fn types_command() -> Command<'static> {
  return Command::new("types").about("Types generating").args(vec![
    Arg::new("include-profiles")
      .long("include-profiles")
      .takes_value(false)
      .help("Include profiles"),
    Arg::new("output")
      .long("output")
      .value_hint(ValueHint::FilePath)
      .required(true)
      .help("Output file"),
    Arg::new("target")
      .long("target")
      .help("Target programming language")
      .takes_value(true)
      .value_parser(["typescript"])
      .default_value("typescript"),
    Arg::new("fhir")
      .long("fhir")
      .help("FHIR related type")
      .takes_value(false),
  ]);
}

pub async fn generate(
  sub_matches: &ArgMatches,
  instance: BoxClient,
  config_dir: PathBuf,
  instance_tag: &str,
) {
  let (types, _cache) = match warm_up_definitions(
    config_dir,
    instance,
    sub_matches.contains_id("include-profiles"),
    instance_tag,
  )
  .await
  {
    Ok(it) => it,
    Err(err) => {
      error!("{:#?}", err);
      exit(0);
    },
  };

  let fhir = sub_matches.contains_id("fhir");
  let output = sub_matches.get_one::<String>("output").unwrap();

  match sub_matches.get_one::<String>("target").unwrap().as_str() {
    "typescript" => write_typescript_types(types, fhir, output.to_owned()),
    unknown => {
      error!("Unknown target {}", unknown);
      exit(0);
    },
  }
}
