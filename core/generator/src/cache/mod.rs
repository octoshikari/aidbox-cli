use serde::de::DeserializeOwned;
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::Error;
use std::path::{Path, PathBuf};

use super::common::Element;

#[derive(Clone)]
pub struct Cache {
  pub primitives: HashMap<String, Value>,
  pub confirms: HashMap<String, Value>,
  pub value_sets: HashMap<String, Vec<String>>,
  pub schema: HashMap<String, HashMap<String, Value>>,
  pub cache_path: PathBuf,
}

pub struct InstanceItemStat {
  pub path: String,
  pub size: u64,
}

pub struct CacheInstanceStat {
  pub total: u64,
  pub items: Vec<InstanceItemStat>,
}

impl Cache {
  pub fn default(instance: &str) -> Result<Self, String> {
    Cache::new(instance, None)
  }

  pub fn new(instance: &str, custom_path: Option<String>) -> Result<Self, String> {
    let home_dir = dirs::home_dir().unwrap();

    let mut cache_path: PathBuf = match custom_path {
      Some(path) => PathBuf::from(path),
      None => {
        let mut new_path = home_dir;
        new_path.push(".aidbox-tool");
        new_path
      },
    };
    cache_path.push(".cache");
    cache_path.push(instance);

    if !cache_path.exists() {
      if let Err(err) = fs::create_dir_all(&cache_path) {
        return Err(err.to_string());
      }
    }

    Ok(Self {
      primitives: HashMap::new(),
      confirms: HashMap::new(),
      value_sets: HashMap::new(),
      schema: HashMap::new(),
      cache_path,
    })
  }

  pub fn restore(&mut self) {
    let confirms = repair_cache_item::<Value>(&self.cache_path, &String::from("confirms")).unwrap();
    let primitives =
      repair_cache_item::<Value>(&self.cache_path, &String::from("primitives")).unwrap();
    let value_sets =
      repair_cache_item::<Vec<String>>(&self.cache_path, &String::from("valuesets")).unwrap();
    let schema =
      repair_cache_item::<HashMap<String, Value>>(&self.cache_path, &String::from("schema"))
        .unwrap();
    self.confirms = confirms;
    self.primitives = primitives;
    self.value_sets = value_sets;
    self.schema = schema
  }

  pub fn save_types_schema(&self, types: &HashMap<String, Element>) -> Result<(), String> {
    match serde_json::to_writer(
      match &File::create(format!(
        "{}/{}.json",
        self.cache_path.to_str().unwrap(),
        "types_schema"
      )) {
        Ok(file) => file,
        Err(err) => return Err(err.to_string()),
      },
      &types,
    ) {
      Err(err) => Err(err.to_string()),
      _ => Ok(()),
    }
  }

  pub fn save(&self) -> Result<(), Error> {
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

  pub fn rm_cache_item(self, key: &str, all: bool) -> Result<(), String> {
    if all {
      match fs::remove_dir_all(self.cache_path) {
        Ok(..) => Ok(()),
        Err(error) => match error.kind() {
          std::io::ErrorKind::NotFound => Err(error.to_string()),
          other_error => Err(format!("Problem deleting cache folder: {:?}", other_error)),
        },
      }
    } else {
      let mut target_path = self.cache_path;
      target_path.push(format!("{}.json", key));

      match fs::remove_file(&target_path) {
        Ok(..) => Ok(()),
        Err(error) => match error.kind() {
          std::io::ErrorKind::NotFound => Err(format!(
            "Path: {} \n {}",
            target_path.to_str().unwrap(),
            error
          )),
          other_error => Err(format!("Problem removing cache item: {:?}", other_error)),
        },
      }
    }
  }

  pub fn instance_stat(self) -> CacheInstanceStat {
    let mut total_size = 0;
    let mut items: Vec<InstanceItemStat> = vec![];

    for file in fs::read_dir(self.cache_path).unwrap() {
      let file_path = file.unwrap().path();
      let metadata = fs::metadata(file_path.clone()).expect("Cannot read cache file");

      total_size += metadata.len();
      items.push(InstanceItemStat {
        path: file_path.to_str().unwrap().to_string(),
        size: metadata.len(),
      })
    }

    CacheInstanceStat {
      total: total_size,
      items,
    }
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
