use clap::{arg, ArgMatches, Command};
use log::{error, info};
use std::fs;

pub fn types_command() -> Command<'static> {
    return Command::new("types")
        .about("Work with types generation")
        .arg_required_else_help(true)
        .subcommand(
            Command::new("generate")
                .about("Generate types from zen schema")
                .arg_required_else_help(true)
                .args(push_generate_args()),
        )
        .subcommand(
            Command::new("clear-cache")
                .about("Clear folder contains cache")
                .arg_required_else_help(true)
                .args(vec![arg!(--folder <PATH> "folder contained cache")]),
        );
}

pub fn types_match(sub_matches: &ArgMatches) -> () {
    let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match types_command {
        ("generate", sub_matches) => {
            let stash = sub_matches.value_of("MESSAGE");
            println!("Applying {:?}", stash);
        }
        ("clear-cache", sub_matches) => clear_cache(sub_matches),
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}

fn push_generate_args() -> Vec<clap::Arg<'static>> {
    vec![arg!(-m --message <MESSAGE>).required(false)]
}

fn clear_cache(sub_matches: &ArgMatches) -> () {
    match fs::remove_dir_all(
        sub_matches
            .value_of("folder")
            .map(str::to_string)
            .as_ref()
            .unwrap(),
    ) {
        Ok(..) => info!("Cache was cleared"),
        Err(error) => match error.kind() {
            std::io::ErrorKind::NotFound => error!("{}", error),
            other_error => {
                panic!("Problem deleting cache folder: {:?}", other_error)
            }
        },
    }
}
