use clap::ArgMatches;
use console::{style, Emoji};
use indicatif::HumanBytes;
use log::{error, info};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::Error;
use std::path::{Path, PathBuf};

use super::common::Element;

pub struct Cache {
  pub primitives: HashMap<String, Value>,
  pub confirms: HashMap<String, Value>,
  pub value_sets: HashMap<String, Vec<String>>,
  pub schema: HashMap<String, HashMap<String, Value>>,
  pub cache_path: PathBuf,
}

impl Cache {
  pub fn save_intermediate_types(&self, types: &HashMap<String, Element>) -> Result<(), Error> {
    return match serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "intermediate_types"
      ))?,
      &types,
    ) {
      Ok(..) => {
        info!("Intermediate types has been saved!");
        Ok(())
      },
      _ => Ok(()),
    };
  }
  pub fn save(&self) -> Result<(), Error> {
    info!("Save result on filesystem started...");

    serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "confirms"
      ))?,
      &self.confirms,
    )?;

    serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "schema"
      ))?,
      &self.schema,
    )?;

    serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "primitives"
      ))?,
      &self.primitives,
    )?;

    serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "valuesets"
      ))?,
      &self.value_sets,
    )?;

    Ok(())
  }
}

fn repair_cache_item<T>(cache_path: &Path, item_name: &str) -> Result<HashMap<String, T>, Error>
where
  T: DeserializeOwned,
{
  if Path::new(format!("{}/{}.json", cache_path.to_str().unwrap(), item_name).as_str()).exists() {
    let json = fs::read_to_string(format!(
      "{}/{}.json",
      cache_path.to_str().unwrap(),
      item_name
    ))?;
    let data: HashMap<String, T> = serde_json::from_str(&json)?;
    Ok(data)
  } else {
    Ok(HashMap::new())
  }
}

pub fn create_cache(cache_path: PathBuf, instance: &str) -> Result<Cache, Error> {
  let mut target_path = cache_path;
  target_path.push(".cache");
  target_path.push(instance);

  if !target_path.exists() {
    match fs::create_dir_all(&target_path) {
      Ok(..) => info!("Cache folder has been created"),
      Err(err) => return Err(err),
    }
  }

  let confirms = repair_cache_item::<Value>(&target_path, &String::from("confirms")).unwrap();
  let primitives = repair_cache_item::<Value>(&target_path, &String::from("primitives")).unwrap();
  let value_sets =
    repair_cache_item::<Vec<String>>(&target_path, &String::from("valuesets")).unwrap();
  let schema =
    repair_cache_item::<HashMap<String, Value>>(&target_path, &String::from("schema")).unwrap();

  Ok(Cache {
    primitives,
    confirms,
    value_sets,
    schema,
    cache_path: target_path,
  })
}

fn clear_cache(sub_matches: &ArgMatches) {
  let all = sub_matches.is_present("all");
  let key = sub_matches.value_of("key").map(str::to_string);
  let instance = sub_matches.value_of("instance").unwrap();

  let mut cache_folder = PathBuf::from(sub_matches.value_of("config").unwrap());
  cache_folder.push(".cache");
  cache_folder.push(instance);

  if all {
    match fs::remove_dir_all(cache_folder) {
      Ok(..) => info!("Cache folder has been removed"),
      Err(error) => match error.kind() {
        std::io::ErrorKind::NotFound => error!("{}", error),
        other_error => {
          panic!("Problem deleting cache folder: {:?}", other_error)
        },
      },
    }
  } else {
    cache_folder.push(format!("{}.json", key.clone().unwrap().as_str()));

    match fs::remove_file(&cache_folder) {
      Ok(..) => info!(
        "Cache item '{}' for instance '{}' has been removed",
        key.unwrap().as_str(),
        instance
      ),
      Err(error) => match error.kind() {
        std::io::ErrorKind::NotFound => {
          error!("Path: {} \n {}", cache_folder.to_str().unwrap(), error)
        },
        other_error => {
          panic!("Problem removing cache item: {:?}", other_error)
        },
      },
    }
  }
}

fn cache_stats(sub_matches: &ArgMatches) {
  let mut cache_folder = PathBuf::from(sub_matches.value_of("config").unwrap());
  let instance = sub_matches.value_of("instance").unwrap();
  let all = sub_matches.is_present("all");

  cache_folder.push(".cache");

  if cache_folder.exists() {
    let mut total_size = 0;

    if all {
      for element in fs::read_dir(&cache_folder).unwrap() {
        let metadata =
          fs::metadata(&element.as_ref().unwrap().path()).expect("Cannot read element metadata");
        if metadata.is_dir() {
          total_size += stat_element(
            cache_folder.clone(),
            element.unwrap().file_name().to_str().unwrap(),
          );
        }
      }
    } else {
      stat_element(cache_folder.clone(), instance);
    }

    println!(
      "{0: <30} {1} {2}",
      "Total size: ",
      Emoji("▶️", "->"),
      style(HumanBytes(total_size)).bold().blue()
    );
  } else {
    error!("Cache folder doesn't exist")
  }
}

fn stat_element(mut cache_folder: PathBuf, instance: &str) -> u64 {
  let mut total_size = 0;

  cache_folder.push(instance);

  println!("{}:", style(instance).green().italic().bold().underlined());

  for file in fs::read_dir(&cache_folder).unwrap() {
    let file_path = file.unwrap().path();
    let metadata = fs::metadata(&file_path).expect("Cannot read cache file");

    total_size += metadata.len();

    println!(
      "{0: <30} {1} {2: <10}",
      file_path.to_str().unwrap().split('/').last().unwrap(),
      Emoji("▶️", "->"),
      HumanBytes(metadata.len())
    );
  }
  println!(
    "{0: <30} {1} {2}",
    "Total item size: ",
    Emoji("▶️", "->"),
    style(HumanBytes(total_size)).green().italic()
  );
  println!();

  return total_size;
}

pub fn cache_command(sub_matches: &ArgMatches) {
  let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));

  match types_command {
    ("rm", sub_matches) => clear_cache(sub_matches),
    ("stats", sub_matches) => cache_stats(sub_matches),
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
