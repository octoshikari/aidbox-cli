use clap::ArgMatches;
use log::{error, info};
use std::fs;

pub(crate) fn clear_cache(sub_matches: &ArgMatches) -> () {
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
