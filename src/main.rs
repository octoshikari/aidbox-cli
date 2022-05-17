mod r#box;
mod devbox;
mod types;

use chrono::Local;
use clap::Command;
use log::LevelFilter;
use std::io::Write;
use std::path::PathBuf;

fn get_home_dir(path: &mut PathBuf) -> &str {
    path.push(".aidbox");
    path.push("config");

    return path.to_str().unwrap();
}

fn main() {
    tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
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
                .filter_level(LevelFilter::Info)
                .init();

            let config_path = get_home_dir(&mut dirs::home_dir().unwrap().to_path_buf());

            let matches = Command::new("aidbox")
                .about("Aidbox CLI tool")
                .version(env!("CARGO_PKG_VERSION"))
                .subcommand_required(true)
                .arg_required_else_help(true)
                .allow_external_subcommands(true)
                .allow_invalid_utf8_for_external_subcommands(true)
                .args(vec![clap::Arg::new("config")
                    .short('c')
                    .value_name("CONFIG")
                    .help("Config file path")
                    .default_value(config_path.clone())])
                .subcommand(types::types_command())
                .subcommand(devbox::devbox_command())
                .subcommand(r#box::commands())
                .get_matches();

            match matches.subcommand() {
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
        })
}
