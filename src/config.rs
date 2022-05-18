use clap::ArgMatches;
use log::info;
use serde::{Deserialize, Serialize};
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
  pub user_info: Option<Value>,
  pub box_info: Option<Value>,
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Config {
  config_dir: PathBuf,
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
      &File::create(&self.config_file).expect("Cannot save config file"),
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
