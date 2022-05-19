mod generate;
mod writer;

use crate::config::Config;
use crate::r#box::requests::BoxConfig;
use clap::{Arg, ArgMatches, Command};

pub fn types_command() -> Command<'static> {
  return Command::new("types")
    .about("Work with types generation")
    .arg_required_else_help(true)
    .subcommand(
      Command::new("generate")
        .about("Generate types from zen schema")
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
        ]),
    );
}

pub async fn types_match(sub_matches: &ArgMatches, instance: BoxConfig, key: &str, config: Config) {
  let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match types_command {
    ("generate", sub_matches) => {
      generate::generate(sub_matches, instance, config.config_dir, key).await
    },
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
