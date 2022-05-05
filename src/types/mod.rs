mod r#box;
mod cache;
mod generate;
mod reader;

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
                    arg!(-b --box <URL> "Aibox URL"),
                    arg!(-u --user <USERNAME> "Aidbox basic auth user"),
                    arg!(-s --secret <SECRET> "Aidbox basic auth secret"),
                    Arg::new("cache-folder")
                        .long("cache-folder")
                        .help("Cache folder path")
                        .default_value(".local-cache"),
                    Arg::new("cache")
                        .long("cache")
                        .short('c')
                        .takes_value(false)
                        .help("Use cache"),
                    Arg::new("include-profiles")
                        .long("include-profiles")
                        .short('i')
                        .takes_value(false)
                        .help("Include profiles"),
                    Arg::new("OUTPUT")
                        .long("output")
                        .short('o')
                        .help("Output file")
                        .default_value("aidbox-generated-types.ts"),
                ]),
        )
        .subcommand(
            Command::new("clear-cache")
                .about("Clear folder contains cache")
                .arg_required_else_help(true)
                .args(vec![arg!(--folder <PATH> "folder contained cache")]),
        );
}

pub async fn types_match(sub_matches: &ArgMatches) {
    let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match types_command {
        ("generate", sub_matches) => generate::generate(sub_matches).await,
        ("clear-cache", sub_matches) => cache::clear_cache(sub_matches),
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}
