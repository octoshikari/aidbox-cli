use clap::ArgMatches;
use log::{error, info};
use serde_json::Value;
use std::any::Any;
use std::collections::HashMap;
use std::fmt::format;
use std::fs;
use std::io::Error;
use std::iter::Map;
use std::path::Path;

struct ZenSchema {}

pub struct Cache {
    pub primitives: HashMap<String, Value>,
    pub confirms: HashMap<String, Value>,
    pub value_sets: HashMap<String, Value>,
    pub schema: HashMap<String, Value>,
    cache_path: String,
    cache_enabled: bool,
}

// export type Cache = {
// clearFolder: () => void;
// save: () => void;
// saveIntermediateTypes: (types: Types) => void;
// };

fn repair_cache_item(
    cache_path: &str,
    item_name: &str,
    enable: bool,
) -> Result<HashMap<String, Value>, Error> {
    return if enable {
        let json = fs::read_to_string(format!("{}/{}.json", cache_path, item_name))?;
        let data: HashMap<String, Value> = serde_json::from_str(&json)?;
        Ok(data)
    } else {
        Ok(HashMap::new())
    };
}

pub fn create_cache(cache_enabled: bool, cache_path: String) -> Result<Cache, Error> {
    if !Path::new(&cache_path).is_dir() {
        match fs::create_dir(&cache_path) {
            Ok(it) => info!("Cache folder has been created"),
            Err(err) => return Err(err),
        }
    }

    let confirms =
        repair_cache_item(&cache_path, &String::from("confirms"), cache_enabled).unwrap();
    let primitives =
        repair_cache_item(&cache_path, &String::from("primitives"), cache_enabled).unwrap();
    let value_sets =
        repair_cache_item(&cache_path, &String::from("valuesets"), cache_enabled).unwrap();
    let schema = repair_cache_item(&cache_path, &String::from("schema"), cache_enabled).unwrap();

    return Ok(Cache {
        primitives,
        confirms,
        value_sets,
        schema,
        cache_path,
        cache_enabled,
    });
}

pub fn clear_cache(sub_matches: &ArgMatches) -> () {
    match fs::remove_dir_all(sub_matches.value_of("folder").unwrap().to_string()) {
        Ok(..) => info!("Cache was cleared"),
        Err(error) => match error.kind() {
            std::io::ErrorKind::NotFound => error!("{}", error),
            other_error => {
                panic!("Problem deleting cache folder: {:?}", other_error)
            }
        },
    }
}
