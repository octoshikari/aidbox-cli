pub mod matches;

use clap::{Arg, ArgAction, ArgMatches, Command, ValueHint};

pub fn commands() -> Command {
  Command::new("box")
    .about("Interact with aidbox")
    .arg_required_else_help(true)
    .subcommand_required(true)
    .args(vec![Arg::new("instance")
      .long("instance")
      .global(true)
      .value_hint(ValueHint::DirPath)
      .help("Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)")
      .default_value("default")])
    .subcommand(Command::new("configure").about("Initialize aidbox config"))
    .subcommand(Command::new("rm").about("Remove instance config"))
    .subcommand(Command::new("open").about("Open Aidbox UI"))
    .subcommand(
      Command::new("list")
        .about("Show all available instances")
        .args(vec![Arg::new("check")
          .long("check")
          .action(ArgAction::Set)
          .help("Check if the configuration of each instance is correct")]),
    )
    .subcommand(Command::new("info").about("Show box info based on $version endpoint"))
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
  let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match box_command {
    ("configure", sub_matches) => matches::configure(sub_matches).await,
    ("rm", sub_matches) => matches::rm_instance_config(sub_matches),
    ("info", sub_matches) => matches::get_box_info(sub_matches).await,
    ("list", sub_matches) => matches::instance_list(sub_matches).await,
    ("open", sub_matches) => matches::open_ui(sub_matches),
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
