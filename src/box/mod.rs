mod matches;
mod requests;

use clap::{ArgMatches, Command};

pub fn commands() -> Command<'static> {
    return Command::new("box")
        .about("Interact with box instance")
        .arg_required_else_help(true)
        .subcommand(Command::new("configure").about(
            "Initialize box config. With --instance arg, data will be stored under specific key",
        ))
        .subcommand(Command::new("rm").about(
            "Remove box instance config. With --instance arg, specific config key will be removed",
        ))
        .subcommand(Command::new("info").about(
            "Show box info based on $version endpoint. With --instance arg, specific config key will be removed",
        ))
        .subcommand(Command::new("current-user").about(
            "Show current user info based on provided credentials. With --instance arg, specific config key will be removed",
        ));
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
    let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match box_command {
        ("configure", sub_matches) => matches::configure(sub_matches).await,
        ("rm", sub_matches) => matches::rm_instance_config(sub_matches),
        ("info", sub_matches) => matches::get_box_info(sub_matches),
        ("current-user", sub_matches) => matches::get_user_info(sub_matches),
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}
