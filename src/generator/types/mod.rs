mod writer;
use std::{path::PathBuf, process::exit};

use clap::{Arg, ArgMatches, Command};
use log::{error, info};

use crate::r#box::requests::BoxClient;

use self::writer::write_types;

use super::{cache::create_cache, reader::read_schema};

pub fn types_command() -> Command<'static> {
  return Command::new("types")
    .about("Work with types generation")
    .args(vec![
      Arg::new("include-profiles")
        .long("include-profiles")
        .takes_value(false)
        .help("Include profiles"),
      Arg::new("output")
        .long("output")
        .help("Output file")
        .default_value("aidbox-generated-types.ts"),
      Arg::new("fhir")
        .long("fhir")
        .help("FHIR related type")
        .takes_value(false),
    ]);
}

pub async fn generate(
  sub_matches: &ArgMatches,
  instance: BoxClient,
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

  let types = match read_schema(
    instance,
    &mut cache,
    sub_matches.is_present("include-profiles"),
  )
  .await
  {
    Ok(it) => {
      info!("Schema readied");
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
  // write_types(
  //   types,
  //   cache,
  //   sub_matches.is_present("fhir"),
  //   output_file.to_string(),
  // );
}
