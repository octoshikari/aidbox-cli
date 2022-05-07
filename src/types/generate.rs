use crate::types::cache::create_cache;
use crate::types::r#box::{create_box, ConnectionConfig};
use crate::types::reader::generate_types;
use crate::types::writer::write_types;
use clap::ArgMatches;
use exitcode::OK;
use log::{error, info};
use std::process::exit;

pub async fn generate(sub_matches: &ArgMatches) {
    let user = sub_matches.value_of("user").unwrap();
    let url = sub_matches.value_of("box").unwrap();
    let secret = sub_matches.value_of("secret").unwrap();
    let output_file = sub_matches.value_of("output").unwrap();
    let fhir = sub_matches.value_of("fhir").is_some();

    let box_instance = match create_box(ConnectionConfig {
        base_url: url.to_string(),
        username: user.to_string(),
        secret: secret.to_string(),
    })
    .await
    {
        Ok(it) => it,
        Err(error) => {
            error!("{}", error.to_string());
            exit(OK);
        }
    };
    let cache_init = create_cache(
        sub_matches.is_present("cache"),
        sub_matches
            .value_of("cache-folder")
            .as_ref()
            .unwrap()
            .to_string(),
    );
    let mut cache = match cache_init {
        Err(err) => {
            error!("Cache creating error: {:}", err.to_string());
            exit(OK);
        }
        Ok(it) => {
            info!("Cache ready!");
            it
        }
    };

    let types = match generate_types(
        box_instance,
        &mut cache,
        sub_matches.is_present("include-profiles"),
    )
    .await
    {
        Ok(it) => {
            info!("Intermediate types ready");
            it
        }
        Err(err) => {
            error!("{:#?}", err);
            exit(exitcode::OK);
        }
    };

    match cache.save_intermediate_types(&types) {
        Ok(..) | Err(..) => {}
    }

    match cache.save() {
        Ok(..) | Err(..) => {}
    }
    write_types(types, cache, fhir, output_file.to_string());
}
