use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Boxes {
    url: String,
    username: String,
    password: String,
    user: HashMap<String, Value>,
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct Config {
    config_dir: PathBuf,
    config_file: PathBuf,
    boxes: Option<HashMap<String, Boxes>>,
}

impl Config {
    pub fn new(path: String) -> Config {
        let config_dir = PathBuf::from(path);

        if !config_dir.exists() {
            fs::create_dir_all(&config_dir).expect("Cannot create config dir");
        }

        let mut config_file = config_dir.clone();
        config_file.push("config");

        let boxes: Option<HashMap<String, Boxes>> = match config_file.exists() {
            true => {
                let json = fs::read_to_string(&config_file).expect("Cannot read config file");
                let data: HashMap<String, Boxes> =
                    serde_json::from_str(&json).expect("Cannot parse config file");
                Some(data)
            }
            false => {
                fs::create_dir_all(&config_dir).expect("Cannot create config file");
                None
            }
        };

        Self {
            config_file,
            config_dir,
            boxes,
        }
    }
}
