use chrono::{DateTime, Utc};
use clap::{Arg, ArgMatches, ValueHint};
use log::{error, info};
use serde::{Deserialize, Deserializer, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoxInstance {
  pub url: String,
  pub client: String,
  pub secret: String,
  pub status: bool,
  #[serde(default = "default_status_message")]
  pub status_message: String,
  #[serde(default, deserialize_with = "config_option_datefmt")]
  pub last_checked: Option<DateTime<Utc>>,
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

impl Config {
  pub fn new(matches: &ArgMatches) -> Config {
    let config_dir = PathBuf::from(matches.get_one::<String>("config").unwrap());

    if !config_dir.exists() {
      if let Err(err) = fs::create_dir_all(&config_dir) {
        error!(
          "Cannot create config dir by path '{}'. Error: {}",
          config_dir.to_str().unwrap(),
          err.to_string()
        );
        std::process::exit(1);
      }
    }

    let mut config_file = config_dir.clone();
    config_file.push("config");

    let boxes = match config_file.exists() {
      true => match fs::read_to_string(&config_file) {
        Ok(it) => match toml::from_str::<HashMap<String, BoxInstance>>(&it) {
          Ok(res) => res,
          Err(err) => {
            error!("Cannot parse config file. Error: {}", err.to_string());
            std::process::exit(1);
          },
        },
        Err(err) => {
          error!("Cannot read config file. Error: {}", err.to_string());
          std::process::exit(1);
        },
      },
      false => HashMap::new(),
    };

    Self {
      config_file,
      config_dir,
      boxes,
    }
  }

  pub fn update_boxes(&mut self, key: String, value: BoxInstance) {
    self.boxes.insert(key, value);

    match fs::write(&self.config_file, toml::to_string(&self.boxes).expect("")) {
      Ok(..) => {
        info!("Config file successfully update");
      },
      Err(e) => {
        error!("Unable to save config file. Error: {}", e.to_string())
      },
    };
  }
}

pub fn save_on_disk(config_file: PathBuf, boxes: HashMap<String, BoxInstance>) {
  match fs::write(config_file, toml::to_string(&boxes).expect("")) {
    Ok(..) => {
      info!("Config file successfully update");
    },
    Err(e) => {
      error!("Unable to save config file. Error: {}", e.to_string())
    },
  };
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
