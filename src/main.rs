mod r#box;
mod config;
mod devbox;
mod generator;
mod md;
mod verbosity;

use crate::md::app_to_md;
use crate::verbosity::{log_level_filter, set_verbosity};
use chrono::Local;
use clap::{Arg, Command, ValueHint};
use clap_complete::{generate, Generator, Shell};
use human_panic::setup_panic;
use log::Level;
use std::io::Write;
use std::path::PathBuf;
use std::{fs, io};

fn get_home_dir(path: &mut PathBuf) -> &str {
  path.push(".aidbox");

  return path.to_str().unwrap();
}

fn print_completions<G: Generator>(gen: G, cmd: &mut Command) {
  generate(gen, cmd, cmd.get_name().to_string(), &mut io::stdout());
}

#[tokio::main]
async fn main() {
  setup_panic!();

  let path: &'static mut PathBuf = Box::leak(Box::new(dirs::home_dir().unwrap()));

  let config_path: &'static str = Box::leak(Box::new(get_home_dir(path)));
  let mut app = Command::new("aidbox")
        .about("Aidbox CLI that provide useful command for interact with your box instance")
        .version(env!("CARGO_PKG_VERSION"))
        .subcommand_required(true)
        .arg_required_else_help(true)
        .allow_external_subcommands(true)
        .allow_invalid_utf8_for_external_subcommands(true)
        .args(vec![
            Arg::new("verbose")
                .short('v')
                .multiple_occurrences(true)
                .global(true)
                .help("More output per occurrence"),
            Arg::new("quiet")
                .short('q')
                .conflicts_with("verbose")
                .multiple_occurrences(true)
                .global(true)
                .help("Less output per occurrence"),
            Arg::new("config")
                .long("config")
                .value_hint(ValueHint::DirPath)
                .help("Config dir path")
                .global(true)
                .default_value(config_path),
            Arg::new("instance")
                .long("instance")
                .value_hint(ValueHint::DirPath)
                .help("Save box config under specific key. If key already exists then value will be overwritten")
                .global(true)
                .default_value("default"),
        ])
        .subcommand(Command::new("doc").about("Generate doc based on commands and save into USAGE.md file "))
        .subcommand(Command::new("completion").about("Generate autocompletion for several shells").args(vec![Arg::new("generator")
                .help("Generate autocompletion for provided shell")
                .required(true)
                .possible_values(Shell::possible_values())
                .long("generate")]))
        .subcommand(generator::commands())
        .subcommand(devbox::devbox_command())
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
      matches.occurrences_of("quiet") as i8,
      matches.occurrences_of("verbose") as i8,
    )))
    .init();

  match matches.subcommand() {
    Some(("doc", _)) => {
      let markdown = app_to_md(&app, 1).unwrap();
      fs::write("USAGE.md", markdown).unwrap();
    },
    Some(("completion", sub_matches)) => {
      if let Ok(generator) = sub_matches.value_of_t::<Shell>("generator") {
        eprintln!("Generating completion file for {}...", generator);
        print_completions(generator, &mut app);
      };
    },
    Some(("devbox", sub_matches)) => devbox::devbox_match(sub_matches).await,
    Some(("generator", sub_matches)) => generator::sub_matches(sub_matches).await,
    Some(("box", sub_matches)) => r#box::sub_matches(sub_matches).await,
    Some((ext, sub_matches)) => {
      let args = sub_matches
        .values_of_os("")
        .unwrap_or_default()
        .collect::<Vec<_>>();
      println!("Calling out to {:?} with {:?}", ext, args);
    },
    _ => unreachable!(), // If all subcommands are defined above, anything else is unreachable!()
  }
}
