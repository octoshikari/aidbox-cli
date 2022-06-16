mod r#box;
mod config;
mod docker;
mod generator;
pub mod helpers;
mod md;

use crate::md::app_to_md;
use chrono::Local;
use clap::{value_parser, Arg, ArgAction, Command};
use clap_complete::{generate, Shell};
use human_panic::setup_panic;
use log::Level;
use std::io::Write;
use std::{fs, io};

#[tokio::main]
async fn main() {
  setup_panic!();

  let mut app = Command::new("aidbox-cli")
    .about("Aidbox CLI tool")
    .version(env!("CARGO_PKG_VERSION"))
    .subcommand_required(true)
    .arg_required_else_help(true)
    .allow_external_subcommands(true)
    .allow_invalid_utf8_for_external_subcommands(true)
    .args(vec![
      Arg::new("verbose")
        .short('v')
        .action(ArgAction::Count)
        .global(true)
        .help("More output per occurrence"),
      Arg::new("quiet")
        .short('q')
        .conflicts_with("verbose")
        .action(ArgAction::Count)
        .global(true)
        .help("Less output per occurrence"),
    ])
    .subcommand(Command::new("doc").about("Generate USAGE.md file"))
    .subcommand(
      Command::new("completion")
        .about("Generate completion for provided shell")
        .args(vec![Arg::new("shell")
          .help("Shell type")
          .required(true)
          .value_parser(value_parser!(Shell))
          .takes_value(true)
          .long("shell")]),
    )
    .subcommand(generator::commands())
    .subcommand(docker::docker_commands())
    .subcommand(r#box::commands());

  let matches = app.clone().get_matches();

  env_logger::builder()
    .format(|buf, record| {
      let level_style = buf.default_level_style(record.level());
      writeln!(
        buf,
        "[{} {}]: {}",
        Local::now().format("%Y-%m-%d %H:%M:%S"),
        level_style.value(record.level()),
        record.args()
      )
    })
    .filter_level(log_level_filter(set_verbosity(
      Some(Level::Info),
      matches.get_one::<u8>("quiet").copied().unwrap() as i8,
      matches.get_one::<u8>("verbose").copied().unwrap() as i8,
    )))
    .init();

  match matches.subcommand() {
    Some(("doc", _)) => {
      let markdown = app_to_md(&app, 1).unwrap();
      fs::write("USAGE.md", markdown).expect("Unable to write file")
    },
    Some(("completion", sub_matches)) => {
      if let Some(shell) = sub_matches.get_one::<Shell>("shell").copied() {
        println!("Generating completion file for {}...", shell);
        let app_name = app.get_name().to_string();

        generate(shell, &mut app, app_name, &mut io::stdout());
      };
    },
    Some(("docker-image", sub_matches)) => docker::docker_matches(sub_matches).await,
    Some(("generator", sub_matches)) => generator::sub_matches(sub_matches).await,
    Some(("box", sub_matches)) => r#box::sub_matches(sub_matches).await,
    Some((ext, _)) => {
      println!("Calling out to {:?}", ext);
    },
    _ => unreachable!(), // If all subcommands are defined above, anything else is unreachable!()
  }
}

fn level_enum(verbosity: i8) -> Option<Level> {
  match verbosity {
    i8::MIN..=-1 => None,
    0 => Some(Level::Error),
    1 => Some(Level::Warn),
    2 => Some(Level::Info),
    3 => Some(Level::Debug),
    4..=i8::MAX => Some(Level::Trace),
  }
}

pub fn log_level_filter(verbosity: i8) -> log::LevelFilter {
  level_enum(verbosity)
    .map(|l| l.to_level_filter())
    .unwrap_or(log::LevelFilter::Off)
}

pub fn set_verbosity(default: Option<Level>, quiet: i8, verbose: i8) -> i8 {
  level_value(default) - quiet + verbose
}

fn level_value(level: Option<Level>) -> i8 {
  match level {
    None => -1,
    Some(Level::Error) => 0,
    Some(Level::Warn) => 1,
    Some(Level::Info) => 2,
    Some(Level::Debug) => 3,
    Some(Level::Trace) => 4,
  }
}
