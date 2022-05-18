mod r#box;
mod cache;
mod generate;
mod helpers;
mod reader;
mod writer;

use clap::{arg, Arg, ArgMatches, Command};

pub fn types_command() -> Command<'static> {
    return Command::new("types")
        .about("Work with types generation")
        .arg_required_else_help(true)
        .subcommand(
            Command::new("generate")
                .about("Generate types from zen schema")
                .arg_required_else_help(true)
                .args(vec![
                    arg!(-b --box <URL> "Aidbox URL"),
                    arg!(-u --user <USERNAME> "Aidbox basic auth user"),
                    arg!(-s --secret <SECRET> "Aidbox basic auth secret"),
                    Arg::new("cache-folder")
                        .long("cache-folder")
                        .help("Cache folder path")
                        .default_value(".local-cache"),
                    Arg::new("cache")
                        .long("cache")
                        .takes_value(false)
                        .help("Use cache"),
                    Arg::new("include-profiles")
                        .long("include-profiles")
                        .short('i')
                        .takes_value(false)
                        .help("Include profiles"),
                    Arg::new("output")
                        .long("output")
                        .short('o')
                        .help("Output file")
                        .default_value("aidbox-generated-types.ts"),
                    Arg::new("fhir")
                        .long("fhir")
                        .help("FHIR related type")
                        .takes_value(false),
                ]),
        )
        .subcommand(
            Command::new("cache")
                .about("Work with cache items")
                .subcommand(
                    Command::new("rm")
                        .about("Remove cache items")
                        .arg_required_else_help(true)
                        .args(vec![
                            Arg::new("folder")
                                .long("folder")
                                .short('f')
                                .help("Cache folder")
                                .default_value(".local-cache"),
                            Arg::new("all")
                                .long("all")
                                .help("Remove all cache items")
                                .takes_value(false),
                            Arg::new("key")
                                .long("key")
                                .conflicts_with("all")
                                .short('k')
                                .help("Remove specific key item")
                                .possible_values(&[
                                    "confirms",
                                    "primitives",
                                    "schema",
                                    "valuesets",
                                    "symbols",
                                ]),
                        ]),
                )
                .arg_required_else_help(true),
        );
}

pub async fn types_match(sub_matches: &ArgMatches) {
    let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match types_command {
        ("generate", sub_matches) => generate::generate(sub_matches).await,
        ("cache", sub_matches) => cache::cache_command(sub_matches),
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}
