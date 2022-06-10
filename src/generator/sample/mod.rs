use chrono::{Duration, SecondsFormat, TimeZone, Utc};
use std::{collections::HashMap, fs, path::PathBuf};

use clap::{Arg, ArgMatches, Command};
use console::style;
use fake::faker::chrono::raw::DateTimeBetween;
use fake::locales::EN;
use fake::{Fake, Faker};
use log::error;
use rand::seq::SliceRandom;
use serde_json::{Map, Value};

use crate::config::default_config_arg;

pub fn sample_commands() -> Command<'static> {
  return Command::new("sample")
    .about("Generate sample resources based on loaded schemas")
    .args(default_config_arg())
    .args(vec![
      Arg::new("resource")
        .help("Resource name for generation")
        .required(true),
      Arg::new("include-profiles")
        .long("include-profiles")
        .takes_value(false)
        .help("Include profiles"),
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

  cache_folder.push("types_schema.json");

  let schema = match cache_folder.exists() {
    true => {
      let json = fs::read_to_string(cache_folder).expect("");
      let data: HashMap<String, HashMap<String, Value>> = serde_json::from_str(&json).expect("");
      data
    },
    false => {
      error!("Types schema cache doesn't exist.");
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

  if resource_schema.get("is_rpc").unwrap().as_bool().unwrap() {
    error!("Generating RPC calls doesn't support");
    std::process::exit(0);
  }

  if resource_schema.get("schema").is_none() {
    error!("Please provide complex resource name, like Patient, Encounter, etc.",);
    std::process::exit(0);
  }
  let mut result: HashMap<String, Value> = HashMap::new();

  generate_sample(resource, resource_schema.to_owned(), is_full, &mut result);

  println!("{}", serde_json::to_string_pretty(&result).unwrap());
}

fn generate_values(key: &str, value: &Value, result: &mut HashMap<String, Value>) {
  let values = value.get("values").unwrap().as_array().unwrap();

  let is_reference = value.get("is_reference").unwrap().as_bool().unwrap();
  let is_array = value.get("is_array").unwrap().as_bool().unwrap();

  if is_array {
    if is_reference {
      //
      println!("Array reference {:#?}", values);
    } else {
      ////
      println!("Array {:#?}", values);
    }
  } else if is_reference {
    println!("Reference {:#?}", values);
  } else {
    let val = values.choose(&mut rand::thread_rng()).unwrap();

    result.insert(key.to_string(), val.to_owned());
  }
}

fn generate_nested(keys: &Map<String, Value>, is_full: bool, result: &mut HashMap<String, Value>) {
  for (key, value) in keys.iter() {
    if !key.starts_with('_') {
      let required = value.get("require").unwrap().as_bool().unwrap();

      if value.get("sub_type").unwrap().as_null().is_some()
        && value.get("plain_type").unwrap().as_null().is_some()
      {
        if value.get("extends").unwrap().as_null().is_none() {
          let extends = value.get("extends").unwrap().as_array().unwrap();

          if extends.len() == 1 {
            let extend = extends.get(0).unwrap();
            if is_full || required {
              match extend.as_str().unwrap() {
                "boolean" => {
                  //
                  result.insert(key.to_owned(), Value::from(Faker.fake::<bool>()));
                },
                "date" => {
                  let val: chrono::DateTime<Utc> = DateTimeBetween(
                    EN,
                    chrono::Utc.timestamp(31550, 0),
                    Utc::now() - Duration::days(3650),
                  )
                  .fake();
                  result.insert(
                    key.to_owned(),
                    Value::from(val.naive_local().date().to_string()),
                  );
                },
                "dateTime" => {
                  let val: chrono::DateTime<Utc> = DateTimeBetween(
                    EN,
                    chrono::Utc.timestamp(31550, 0),
                    Utc::now() - Duration::days(3650),
                  )
                  .fake();
                  result.insert(
                    key.to_owned(),
                    Value::from(val.to_rfc3339_opts(SecondsFormat::Secs, true)),
                  );
                },
                _ => {
                  //
                  // println!("Simple extend {:#?}", extend)
                },
              }
            }
          }
        } else if value.get("values").is_some() {
          generate_values(key, value, result);
        } else {
          // println!("Empty {} - {}", key, value);
          // std::process::exit(0);
        }
      } else {
        // println!("wtf {} - {}", key, value);
        // std::process::exit(0);
      }
    }
  }
}

fn generate_sample(
  resource: &str,
  schema: HashMap<String, Value>,
  is_full: bool,
  result: &mut HashMap<String, Value>,
) {
  match schema.get("extends") {
    Some(extends) => {
      for val in extends.as_array().unwrap().iter() {
        if val.as_str().unwrap().starts_with("Resource") {
          result.insert("resourceType".to_string(), Value::from(resource));
        }
      }
    },
    None => {},
  }

  generate_nested(
    schema.get("schema").unwrap().as_object().unwrap(),
    is_full,
    result,
  );
}
