pub mod matches;
pub mod requests;

use crate::config::default_config_arg;
use clap::{Arg, ArgMatches, Command, ValueHint};

pub fn commands() -> Command<'static> {
  return Command::new("box")
    .about("Interact with box instance")
    .arg_required_else_help(true)
    .args(default_config_arg())
    .subcommand(Command::new("configure").about("Initialize box config"))
    .subcommand(Command::new("rm").about("Remove box instance config"))
    .subcommand(Command::new("open").about("Open Aidbox UI"))
    .subcommand(Command::new("info").about("Show box info based on $version endpoint"))
    .subcommand(
      Command::new("current-user").about("Show current user info based on provided credentials"),
    )
    .subcommand(
      Command::new("execute-sql")
        .about("Send content of sql file to $psql endpoint and show result")
        .args(vec![Arg::new("file")
          .required(true)
          .help("Path to target .sql file")
          .value_hint(ValueHint::FilePath)]),
    );
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
  let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match box_command {
    ("configure", sub_matches) => matches::configure(sub_matches).await,
    ("rm", sub_matches) => matches::rm_instance_config(sub_matches),
    ("info", sub_matches) => matches::get_box_info(sub_matches),
    ("open", sub_matches) => matches::open_ui(sub_matches),
    ("current-user", sub_matches) => matches::get_user_info(sub_matches),
    ("execute-sql", sub_matches) => matches::execute_sql(sub_matches).await,
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
