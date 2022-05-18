use crate::config::Config;
use clap::{ArgMatches, Command};

pub fn commands() -> Command<'static> {
    return Command::new("box")
        .about("Box instance")
        .arg_required_else_help(true)
        .subcommand(Command::new("configure").about("Initialize box config"))
        .subcommand(
            Command::new("unset")
                .about("Pull latest images from DockerHub")
                .arg_required_else_help(true)
                .args(vec![clap::Arg::new("target")
                    .short('t')
                    .value_name("TARGET")
                    .help("Devbox image tag")]),
        );
}

pub async fn matches(sub_matches: &ArgMatches) {
    let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match box_command {
        ("configure", sub_matches) => {
            let config = Config::new(sub_matches.value_of("config").unwrap().to_string());

            println!("{:#?}", config);
        }
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}
