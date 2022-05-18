mod r#box;
mod config;
mod devbox;
mod md;
mod types;

use crate::md::app_to_md;
use chrono::Local;
use clap::{Arg, Command};
use clap_complete::{generate, Generator, Shell};
use human_panic::setup_panic;
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
            //clap::Arg::new("verbosity").short('v').global(true).help(""),
            clap::Arg::new("config")
                .short('c')
                .long("config")
                .help("Config dir path")
                .global(true)
                .default_value(config_path),
        ])
        .subcommand(Command::new("doc"))
        .subcommand(Command::new("completion").args(vec![Arg::new("generator")
                .help("Generate")
                .required(true)
                .possible_values(Shell::possible_values())
                .long("generate")]))
        .subcommand(types::types_command())
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
        // .filter_level(matches.value_of("verbosity").unwrap().log_level_filter())
        .init();

    match matches.subcommand() {
        Some(("doc", _sub_matches)) => {
            let markdown = app_to_md(&app, 1).unwrap();
            fs::write("USAGE.md", markdown).unwrap();
        }
        Some(("completion", sub_matches)) => {
            if let Ok(generator) = sub_matches.value_of_t::<Shell>("generator") {
                eprintln!("Generating completion file for {}...", generator);
                print_completions(generator, &mut app);
            };
        }
        Some(("devbox", sub_matches)) => devbox::devbox_match(sub_matches).await,
        Some(("types", sub_matches)) => types::types_match(sub_matches).await,
        Some(("box", sub_matches)) => r#box::matches(sub_matches).await,
        Some((ext, sub_matches)) => {
            let args = sub_matches
                .values_of_os("")
                .unwrap_or_default()
                .collect::<Vec<_>>();
            println!("Calling out to {:?} with {:?}", ext, args);
        }
        _ => unreachable!(), // If all subcommands are defined above, anything else is unreachable!()
    }
}
