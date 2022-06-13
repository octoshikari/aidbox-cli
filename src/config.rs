use chrono::{DateTime, Utc};
use clap::{Arg, ArgMatches, ValueHint};
use log::info;
use serde::{Deserialize, Deserializer, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoxInstance {
  pub url: String,
  pub client: String,
  pub secret: String,
  #[serde(default = "default_status")]
  pub status: bool,
  #[serde(default = "default_status_message")]
  pub status_message: String,
  #[serde(default, deserialize_with = "config_option_datefmt")]
  pub last_checked: Option<DateTime<Utc>>,
  pub user_info: Option<Value>,
  pub box_info: Option<Value>,
}

fn default_status() -> bool {
  true
}

fn default_status_message() -> String {
  "".to_string()
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Config {
  pub config_dir: PathBuf,
  config_file: PathBuf,
  pub boxes: HashMap<String, BoxInstance>,
}

impl Config {
  pub fn new(matches: &ArgMatches) -> Config {
    let config_dir = PathBuf::from(matches.value_of("config").unwrap().to_string());

    if !config_dir.exists() {
      fs::create_dir_all(&config_dir).expect("Cannot create config dir");
    }

    let mut config_file = config_dir.clone();
    config_file.push("config");

    let boxes = match config_file.exists() {
      true => {
        let json = fs::read_to_string(&config_file).expect("Cannot read config file");
        let data: HashMap<String, BoxInstance> =
          serde_json::from_str(&json).expect("Cannot parse config file");
        data
      },
      false => {
        fs::create_dir_all(&config_dir).expect("Cannot create config file");
        HashMap::new()
      },
    };

    Self {
      config_file,
      config_dir,
      boxes,
    }
  }

  pub fn update_boxes(&mut self, key: String, value: BoxInstance) {
    self.boxes.insert(key.clone(), value);
    if let Ok(..) = serde_json::to_writer(
      &File::create(&self.config_file).expect("Can't save config file"),
      &self.boxes,
    ) {
      info!(
        "Config file has been update with new value for {} profile",
        key
      );
    };
  }

  pub fn save_on_disk(&mut self) {
    if let Ok(..) = serde_json::to_writer(
      &File::create(&self.config_file).expect("Cannot save config file"),
      &self.boxes,
    ) {
      info!("Config file has been saved on disk");
    };
  }
}

pub fn default_config_arg() -> Vec<Arg<'static>> {
  let path: &'static mut PathBuf = Box::leak(Box::new(dirs::home_dir().unwrap()));

  path.push(".aidbox-cli");

  let config_path: &'static str = Box::leak(Box::new(path.to_str().unwrap()));

  return vec![
    Arg::new("config")
      .long("config")
      .global(true)
      .value_hint(ValueHint::DirPath)
      .help("Config dir path")
      .default_value(config_path),
    Arg::new("instance")
      .long("instance")
      .global(true)
      .value_hint(ValueHint::DirPath)
      .help("Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)")
      .default_value("default"),
  ];
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
