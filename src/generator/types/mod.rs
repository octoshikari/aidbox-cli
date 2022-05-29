mod typescript;

use std::{path::PathBuf, process::exit};

use crate::generator::helpers::warm_up_definitions;
use crate::generator::types::typescript::write_typescript_types;
use clap::{Arg, ArgMatches, Command, ValueHint};
use log::error;

use crate::r#box::requests::BoxClient;

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
        .value_hint(ValueHint::FilePath)
        .required(true)
        .help("Output file"),
      Arg::new("target")
        .long("target")
        .required(true)
        .help("Target programming language")
        .possible_values(&["typescript"]),
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
  let (types, cache) = match warm_up_definitions(
    config_dir,
    instance,
    sub_matches.is_present("include-profiles"),
    instance_tag,
  )
  .await
  {
    Ok(it) => it,
    Err(err) => {
      error!("{:#?}", err);
      exit(0);
    },
  };

  let fhir = sub_matches.is_present("fhir");
  let output = sub_matches.value_of("output").unwrap().to_string();

  match sub_matches.value_of("target").unwrap() {
    "typescript" => write_typescript_types(types, cache, fhir, output),
    _ => {
      error!("Unknown target");
      std::process::exit(0);
    },
  }
}
