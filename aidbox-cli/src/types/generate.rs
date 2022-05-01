use crate::types::cache::{create_cache, TypeElement, TypeElementPart};
use crate::types::r#box::{create_box, ConnectionConfig};
use clap::ArgMatches;
use exitcode::OK;
use log::{error, info};
use std::error::Error;

pub async fn generate(sub_matches: &ArgMatches) -> () {
    let user = sub_matches.value_of("user").unwrap();
    let url = sub_matches.value_of("box").unwrap();
    let secret = sub_matches.value_of("secret").unwrap();

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
            std::process::exit(OK);
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
    let cache = match cache_init {
        Err(err) => {
            error!("Cache creating error: {:}", err.to_string());
            std::process::exit(OK);
        }
        Ok(it) => {
            info!("Cache ready!");
            it
        }
    };
    match box_instance
        .get_concept("hl7-fhir-r4-core.value-set.identity-assuranceLevel/value-set".to_string())
        .await
    {
        Ok(_) => {}
        Err(err) => {
            error!("{:#?}", err)
        }
    }
}
