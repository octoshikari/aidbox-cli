pub mod generate;
mod writer;
use clap::{Arg, Command};

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
