use std::{collections::HashMap, fs, path::PathBuf};

use clap::{Arg, ArgMatches, Command};
use console::style;
use log::error;
use serde_json::Value;

use crate::config::default_config_arg;

pub fn sample_commands() -> Command<'static> {
  return Command::new("sample")
    .about("Generate sample resources based on loaded schemas")
    .args(default_config_arg())
    .args(vec![
      Arg::new("resource")
        .help("Resource name for generation")
        .required(true),
      Arg::new("type")
        .long("type")
        .required(true)
        .possible_values(&["full", "only-required"])
        .help("Generate partial or full resource"),
    ]);
}

pub async fn sample_match(sub_matches: &ArgMatches, mut cache_folder: PathBuf) {
  let resource = sub_matches.value_of("resource").unwrap();

  let is_full = match sub_matches.value_of("type").unwrap() {
    "full" => true,
    "only_required" => false,
    _ => false,
  };

  cache_folder.push("intermediate_types.json");

  let schema = match cache_folder.exists() {
    true => {
      let json = fs::read_to_string(cache_folder).expect("");
      let data: HashMap<String, HashMap<String, Value>> = serde_json::from_str(&json).expect("");
      data
    },
    false => {
      error!(
        "Intermediate types cache doesn't exist. Please run '{}'",
        style("aidbox generator warm-up").cyan()
      );
      std::process::exit(0);
    },
  };

  let resource_schema = match schema.get(resource) {
    Some(it) => it,
    None => {
      error!(
        "Resource {} doesn't exist in cached schema",
        style(resource).cyan()
      );
      std::process::exit(0);
    },
  };

  if resource_schema.get("sub_type").is_none() {
    error!("Please provide complex resource name, like Patient, Encounter, etc.",);
    std::process::exit(0);
  }
  let result_resource = HashMap::new();

  let result = generate_sample(
    resource_schema.to_owned().get("sub_type").unwrap(),
    is_full,
    result_resource,
  );

  println!("{}", serde_json::to_string_pretty(&result).unwrap());
}

fn generate_sample(
  schema: &Value,
  is_full: bool,
  mut result: HashMap<String, Value>,
) -> HashMap<String, Value> {
  for (key, value) in schema.as_object().unwrap().iter() {
    if value.as_object().unwrap().get("plain_type").is_some() {
      let plain_type = value.as_object().unwrap().get("plain_type").unwrap();
      result.insert(key.to_string(), plain_type.to_owned());
    } else {
      println!("{} - {}", key, value);
    }
  }

  return result;
}
