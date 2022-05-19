use crate::generator::cache::create_cache;
use crate::generator::reader::generate_types;
use crate::generator::types::writer::write_types;
use crate::r#box::requests::BoxConfig;
use clap::ArgMatches;
use log::{error, info};
use std::path::PathBuf;
use std::process::exit;

pub async fn generate(
  sub_matches: &ArgMatches,
  instance: BoxConfig,
  config_dir: PathBuf,
  instance_tag: &str,
) {
  let output_file = sub_matches.value_of("output").unwrap();

  let cache_init = create_cache(config_dir, instance_tag);
  let mut cache = match cache_init {
    Err(err) => {
      error!("Cache creating error: {:}", err.to_string());
      exit(0);
    },
    Ok(it) => {
      info!("Cache ready!");
      it
    },
  };
  let types = match generate_types(
    instance,
    &mut cache,
    sub_matches.is_present("include-profiles"),
  )
  .await
  {
    Ok(it) => {
      info!("Intermediate types ready");
      it
    },
    Err(err) => {
      error!("{:#?}", err);
      exit(0);
    },
  };
  match cache.save_intermediate_types(&types) {
    Ok(..) | Err(..) => {},
  }
  match cache.save() {
    Ok(..) | Err(..) => {},
  }
  write_types(
    types,
    cache,
    sub_matches.is_present("fhir"),
    output_file.to_string(),
  );
}
