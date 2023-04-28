mod aidbox;
mod generator;

use chrono::Local;
use clap::{value_parser, Arg, ArgAction, Command};
use clap_complete::{generate, Generator, Shell};
use human_panic::setup_panic;
use log::Level;
use std::io;
use std::io::Write;

#[tokio::main]
async fn main() {
  setup_panic!();

  let mut app = Command::new("aidbox-tool")
    .about("Aidbox mutlitool")
    .author("Alex Streltsov <funyloony@gmail.com>")
    .version(env!("CARGO_PKG_VERSION"))
    .subcommand_required(true)
    .arg_required_else_help(true)
    .allow_external_subcommands(true)
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
    .subcommand(
      Command::new("completion")
        .about("Generate completion for provided shell")
        .args(vec![Arg::new("shell")
          .help("Shell type")
          .required(true)
          .value_parser(value_parser!(Shell))
          .long("shell")]),
    )
    .subcommand(generator::commands())
    .subcommand(aidbox::commands());

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
    Some(("completion", sub_matches)) => {
      if let Some(generator) = sub_matches.get_one::<Shell>("shell") {
        eprintln!("Generating completion file for {generator}...");
        print_completions(*generator, &mut app);
      }
    },
    Some(("generator", sub_matches)) => generator::sub_matches(sub_matches).await,
    Some(("box", sub_matches)) => aidbox::sub_matches(sub_matches).await,
    Some((ext, _)) => {
      println!("Calling out to {ext}");
    },
    _ => unreachable!(), // If all subcommands are defined above, anything else is unreachable!()
  }
}

fn print_completions<G: Generator>(gen: G, cmd: &mut Command) {
  generate(gen, cmd, cmd.get_name().to_string(), &mut io::stdout());
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

#[must_use]
pub fn log_level_filter(verbosity: i8) -> log::LevelFilter {
  level_enum(verbosity).map_or(log::LevelFilter::Off, |l| l.to_level_filter())
}

#[must_use]
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
