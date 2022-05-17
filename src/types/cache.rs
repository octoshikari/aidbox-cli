use clap::ArgMatches;
use log::{error, info};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::fs::File;
use std::io::Error;
use std::path::Path;

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
    pub cache_path: String,
    pub cache_enabled: bool,
}

impl Cache {
    pub fn save_intermediate_types(
        &self,
        types: &HashMap<String, TypeElementPart>,
    ) -> Result<(), Error> {
        info!("Save intermediate types into file...");

        return match serde_json::to_writer(
            &File::create(format!("{}/{}.json", self.cache_path, "intermediate_types"))?,
            &types,
        ) {
            Ok(..) => {
                info!("Intermediate types has been saved!");
                Ok(())
            }
            _ => Ok(()),
        };
    }
    pub fn save(&self) -> Result<(), Error> {
        if self.cache_enabled {
            info!("Save result on filesystem started...");

            if let Ok(..) = serde_json::to_writer(
                &File::create(format!("{}/{}.json", self.cache_path, "confirms"))?,
                &self.confirms,
            ) {
                info!("Confirms list has been saved!");
            };

            if let Ok(..) = serde_json::to_writer(
                &File::create(format!("{}/{}.json", self.cache_path, "schema"))?,
                &self.schema,
            ) {
                info!("Schema has been saved!");
            };

            if let Ok(..) = serde_json::to_writer(
                &File::create(format!("{}/{}.json", self.cache_path, "primitives"))?,
                &self.primitives,
            ) {
                info!("Primitives list has been saved!");
            };

            if let Ok(..) = serde_json::to_writer(
                &File::create(format!("{}/{}.json", self.cache_path, "valuesets"))?,
                &self.value_sets,
            ) {
                info!("Values sets has been saved!");
            };
        } else {
            info!("Use cache disabled");
        };
        Ok(())
    }
}

fn repair_cache_item<T>(
    cache_path: &str,
    item_name: &str,
    enable: bool,
) -> Result<HashMap<String, T>, Error>
where
    T: DeserializeOwned,
{
    return if enable {
        if Path::new(format!("{}/{}.json", cache_path, item_name).as_str()).exists() {
            let json = fs::read_to_string(format!("{}/{}.json", cache_path, item_name))?;
            let data: HashMap<String, T> = serde_json::from_str(&json)?;
            Ok(data)
        } else {
            Ok(HashMap::new())
        }
    } else {
        Ok(HashMap::new())
    };
}

pub fn create_cache(cache_enabled: bool, cache_path: String) -> Result<Cache, Error> {
    if !Path::new(&cache_path).is_dir() {
        match fs::create_dir(&cache_path) {
            Ok(..) => info!("Cache folder has been created"),
            Err(err) => return Err(err),
        }
    }

    let confirms =
        repair_cache_item::<Value>(&cache_path, &String::from("confirms"), cache_enabled).unwrap();
    let primitives =
        repair_cache_item::<Value>(&cache_path, &String::from("primitives"), cache_enabled)
            .unwrap();
    let value_sets =
        repair_cache_item::<Vec<String>>(&cache_path, &String::from("valuesets"), cache_enabled)
            .unwrap();
    let schema = repair_cache_item::<HashMap<String, Value>>(
        &cache_path,
        &String::from("schema"),
        cache_enabled,
    )
    .unwrap();

    Ok(Cache {
        primitives,
        confirms,
        value_sets,
        schema,
        cache_path,
        cache_enabled,
    })
}

fn clear_cache(sub_matches: &ArgMatches) {
    let all = sub_matches.is_present("all");
    let key = sub_matches.value_of("key").map(str::to_string);

    let cache_folder = sub_matches.value_of("folder").unwrap();
    if all {
        match fs::remove_dir_all(cache_folder) {
            Ok(..) => info!("Cache folder has been removed"),
            Err(error) => match error.kind() {
                std::io::ErrorKind::NotFound => error!("{}", error),
                other_error => {
                    panic!("Problem deleting cache folder: {:?}", other_error)
                }
            },
        }
    } else if key.is_some() {
        match fs::remove_file(format!(
            "{}/{}.json",
            cache_folder,
            key.clone().unwrap().as_str()
        )) {
            Ok(..) => info!("Cache item - {} - has been removed", key.unwrap().as_str()),
            Err(error) => match error.kind() {
                std::io::ErrorKind::NotFound => error!(
                    "Path: {} \n {}",
                    format!("{}/{}.json", cache_folder, key.unwrap().as_str()),
                    error
                ),
                other_error => {
                    panic!("Problem removing cache item: {:?}", other_error)
                }
            },
        }
    } else {
        error!("Please provide --key arg or -all");
    }
}

pub fn cache_command(sub_matches: &ArgMatches) {
    let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));

    match types_command {
        ("rm", sub_matches) => clear_cache(sub_matches),
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}
