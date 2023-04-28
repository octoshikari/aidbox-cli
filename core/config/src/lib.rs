use chrono::{DateTime, Utc};
use serde::{Deserialize, Deserializer, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Deserialize, Clone)]
pub struct ExcludeConfig {
  pub ns: Option<Vec<String>>,
  pub symbols: Option<Vec<String>>,
  pub tags: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct BoxInstance {
  pub url: String,
  pub client: String,
  pub secret: String,
  pub status: bool,
  #[serde(default = "default_status_message")]
  pub status_message: String,
  #[serde(default, deserialize_with = "config_option_datefmt")]
  pub last_checked: Option<DateTime<Utc>>,
  pub tags: Option<Vec<String>>,
}

fn default_status_message() -> String {
  "".to_string()
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Config {
  pub config_dir: PathBuf,
  pub config_file: PathBuf,
  pub boxes: HashMap<String, BoxInstance>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct BoxConfig {
  pub key: String,
  pub url: String,
  pub client: String,
  pub secret: String,
  pub tags: Option<Vec<String>>,
}

impl BoxInstance {
  #[must_use]
  pub fn to_box_config(self, key: String) -> BoxConfig {
    BoxConfig {
      key,
      url: self.url,
      client: self.client,
      secret: self.secret,
      tags: self.tags,
    }
  }
}

impl Config {
  pub fn new(custom_path: Option<String>) -> Result<Config, String> {
    let home_dir = dirs::home_dir().unwrap();

    let mut config_dir: PathBuf = match custom_path {
      Some(path) => PathBuf::from(path),
      None => home_dir,
    };

    config_dir.push(".aidbox-tool");

    if !config_dir.exists() {
      let fs_result = fs::create_dir_all(&config_dir);
      if let Err(err) = fs_result {
        return Err(err.to_string());
      }
    }

    let mut config_file = config_dir.clone();
    config_file.push("boxes");

    match read_boxes(config_file.clone()) {
      Ok(boxes) => Ok(Self {
        config_file,
        config_dir: config_dir.to_path_buf(),
        boxes,
      }),
      Err(message) => Err(message),
    }
  }

  pub fn add_box(&mut self, key: String, value: BoxInstance, prev_key: String) -> String {
    self.boxes.remove(prev_key.as_str());
    self.boxes.insert(key, value);

    match fs::write(&self.config_file, toml::to_string(&self.boxes).expect("")) {
      Ok(..) => "Config file successfully update".to_string(),
      Err(e) => format!("Unable to save config file. Error: {}", e),
    }
  }
  /// # Errors
  ///
  /// Will return `Err` if saveing file are failing
  pub fn rm_box(&mut self, key: &str) -> Result<(), String> {
    self.boxes.remove(key);

    match fs::write(&self.config_file, toml::to_string(&self.boxes).expect("")) {
      Ok(..) => Ok(()),
      Err(e) => Err(format!("Unable to save config file. Error: {}", e)),
    }
  }
  /// # Errors
  ///
  /// Will return `Err` if saveing file are failing
  #[must_use]
  pub fn save_on_disk(self, boxes: &HashMap<String, BoxInstance>) -> String {
    match fs::write(self.config_file, toml::to_string(&boxes).expect("")) {
      Ok(..) => "Config file successfully update".to_string(),
      Err(e) => format!("Unable to save config file. Error: {}", e),
    }
  }
}

pub fn read_boxes(config_file: PathBuf) -> Result<HashMap<String, BoxInstance>, String> {
  match config_file.exists() {
    true => match fs::read_to_string(&config_file) {
      Ok(it) => match toml::from_str::<HashMap<String, BoxInstance>>(&it) {
        Ok(boxes) => Ok(boxes),
        Err(err) => Err(format!("Cannot parse config file. Error: {}", err)),
      },
      Err(err) => Err(format!("Cannot read config file. Error: {}", err)),
    },
    false => Ok(HashMap::new()),
  }
}

fn config_datefmt<'de, D>(deserializer: D) -> Result<DateTime<Utc>, D::Error>
where
  D: Deserializer<'de>,
{
  let s = String::deserialize(deserializer)?;
  s.parse::<DateTime<Utc>>().map_err(serde::de::Error::custom)
}

fn config_option_datefmt<'de, D>(deserializer: D) -> Result<Option<DateTime<Utc>>, D::Error>
where
  D: Deserializer<'de>,
{
  #[derive(Deserialize)]
  struct Wrapper(#[serde(deserialize_with = "config_datefmt")] DateTime<Utc>);

  let v = Option::deserialize(deserializer)?;
  Ok(v.map(|Wrapper(a)| a))
}

pub fn get_config_or_error(instance: &str) -> Result<(Config, &str), String> {
  let config = match Config::new(None) {
    Ok(c) => c,
    Err(err) => {
      return Err(err);
    },
  };
  if config.boxes.get(instance).is_none() {
    Err(format!("Instance '{}' doesn't exist", instance))
  } else {
    Ok((config, instance))
  }
}

pub fn read_exclude_config(path: Option<&String>) -> Result<ExcludeConfig, String> {
  match path {
    Some(p) => match PathBuf::from(p).exists() {
      true => match fs::read_to_string(p) {
        Ok(json) => match serde_json::from_str::<ExcludeConfig>(&json) {
          Ok(data) => Ok(data),
          Err(err) => Err(format!("Error while parsing config json: {}", err)),
        },
        Err(err) => Err(format!("Error while read config json: {}", err)),
      },
      false => Err(format!("{} doesn't exist", p)),
    },
    None => Ok(ExcludeConfig {
      ns: None,
      symbols: None,
      tags: None,
    }),
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use std::path::PathBuf;

  #[test]
  fn empty_dir() {
    assert!(!PathBuf::from("/tmp/aidbox-tool-text").exists());
  }

  #[test]
  fn custom_config_dir() {
    let config = Config::new(Some("/tmp/aidbox-tool-test".to_string()));

    assert!(config.is_ok());

    let config_ok = config.unwrap();

    assert_eq!(
      config_ok.config_dir,
      PathBuf::from("/tmp/aidbox-tool-test/.aidbox-tool"),
    );
    assert_eq!(
      config_ok.config_file,
      PathBuf::from("/tmp/aidbox-tool-test/.aidbox-tool/boxes"),
    );
    let empty_boxes: HashMap<String, BoxInstance> = HashMap::new();
    assert_eq!(config_ok.boxes, empty_boxes);

    match fs::remove_dir_all(PathBuf::from("/tmp/aidbox-tool")) {
      Ok(_) => println!("cleared!"),
      Err(e) => println!("Error wtf: {}", e),
    }
  }
  #[test]
  fn add_box_into_config() {
    let config = Config::new(Some("/tmp/aidbox-tool2".to_string()));

    assert!(config.is_ok());
    let mut config_ok = config.unwrap();

    let empty_boxes: HashMap<String, BoxInstance> = HashMap::new();
    assert_eq!(config_ok.boxes, empty_boxes);

    config_ok.add_box(
      String::from("test"),
      BoxInstance {
        url: "test".to_string(),
        client: "test".to_string(),
        secret: "test".to_string(),
        status: true,
        status_message: "".to_string(),
        last_checked: None,
        tags: None,
      },
      "".to_string(),
    );
    assert!(config_ok.boxes.get(&"test".to_string()).is_some());
    assert!(config_ok.boxes.get(&"test2".to_string()).is_none());

    match fs::remove_dir_all(PathBuf::from("/tmp/aidbox-tool-test2")) {
      Ok(_) => println!("cleared!"),
      Err(e) => println!("Error wtf: {}", e),
    }
  }
}
