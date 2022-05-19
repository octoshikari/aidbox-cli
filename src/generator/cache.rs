use clap::ArgMatches;
use human_bytes::human_bytes;
use log::{error, info};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::Error;
use std::path::{Path, PathBuf};

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct TypeElementSubType {
  pub description: Option<String>,
  pub require: bool,
  pub sub_type: Option<HashMap<String, TypeElementSubType>>,
  pub plain_type: Option<String>,
  pub extends: Option<Vec<String>>,
  pub array: bool,
}

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct TypeElementPart {
  pub description: Option<String>,
  pub sub_type: Option<HashMap<String, TypeElementSubType>>,
  pub source: bool,
  pub profile: bool,
  pub extends: Option<Vec<String>>,
  pub plain_type: Option<String>,
}

#[derive(Serialize)]
pub struct TypeElement {
  pub name: String,
  pub element: TypeElementPart,
}

pub struct Cache {
  pub primitives: HashMap<String, Value>,
  pub confirms: HashMap<String, Value>,
  pub value_sets: HashMap<String, Vec<String>>,
  pub schema: HashMap<String, HashMap<String, Value>>,
  pub cache_path: PathBuf,
}

impl Cache {
  pub fn save_intermediate_types(
    &self,
    types: &HashMap<String, TypeElementPart>,
  ) -> Result<(), Error> {
    info!("Save intermediate types into file...");

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

    if let Ok(..) = serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "confirms"
      ))?,
      &self.confirms,
    ) {
      info!("Confirms list has been saved!");
    };

    if let Ok(..) = serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "schema"
      ))?,
      &self.schema,
    ) {
      info!("Schema has been saved!");
    };

    if let Ok(..) = serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "primitives"
      ))?,
      &self.primitives,
    ) {
      info!("Primitives list has been saved!");
    };

    if let Ok(..) = serde_json::to_writer(
      &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "valuesets"
      ))?,
      &self.value_sets,
    ) {
      info!("Values sets has been saved!");
    };
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

  cache_folder.push(".cache");
  cache_folder.push(instance);

  if cache_folder.exists() {
    let mut total_size: f64 = 0.0;

    println!("Cache items for instance '{}':", instance);
    println!("-----------------------------------------");

    for file in fs::read_dir(&cache_folder).unwrap() {
      let file_path = file.unwrap().path();
      let metadata = fs::metadata(&file_path).expect("Cannot read cache file");

      total_size += metadata.len() as f64;

      println!(
        "{0: <30} | {1: <10}",
        file_path.to_str().unwrap().split('/').last().unwrap(),
        human_bytes(metadata.len() as f64)
      );
    }
    println!("-----------------------------------------");
    println!(
      "Total cache size for instance '{}' - {}",
      instance,
      human_bytes(total_size)
    )
  } else {
    error!("Cache folder doesn't exist")
  }
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
