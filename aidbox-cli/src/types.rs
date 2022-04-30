use clap::{arg, ArgMatches, Command};
use std::path::Path;

pub fn types_command() -> Command<'static> {
    return Command::new("types")
        .about("Work with types generation")
        .arg_required_else_help(true)
        .subcommand(Command::new("generate").about("Generate types from zen schema").args(push_generate_args()))
        .subcommand(Command::new("clear-cache").args(vec![arg!(-f --folder <PATH>).required(true)]));
}


pub fn types_match(sub_matches: &ArgMatches) -> () {
    let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match types_command {
        ("generate", sub_matches) => {
            let stash = sub_matches.value_of("PATH");
            println!("Applying {:?}", stash);
        }
        ("clear-cache", sub_matches) => {
            let path = sub_matches.value_of("PATH");
            clear_cache(path)
        }
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}


fn push_generate_args() -> Vec<clap::Arg<'static>> {
    vec![arg!(-m --message <MESSAGE>).required(false)]
}

pub fn clear_cache(path: Option<&str>) -> () {
    println!("{}", Path::new(path.map(str::to_string).as_ref().unwrap()).exists());
}