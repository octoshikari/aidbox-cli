use clap::ArgMatches;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Boxes {
    pub url: String,
    pub username: String,
    pub password: String,
    pub user: HashMap<String, Value>,
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Config {
    config_dir: PathBuf,
    config_file: PathBuf,
    pub boxes: HashMap<String, Boxes>,
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
                let data: HashMap<String, Boxes> =
                    serde_json::from_str(&json).expect("Cannot parse config file");
                data
            }
            false => {
                fs::create_dir_all(&config_dir).expect("Cannot create config file");
                let empty_boxes = HashMap::new();
                empty_boxes
            }
        };

        Self {
            config_file,
            config_dir,
            boxes,
        }
    }
    pub fn update_boxes(&mut self, key: String, value: Boxes) {
        self.boxes.insert(key, value);
    }
}
