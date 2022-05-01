mod devbox;
mod types;

use chrono::Local;
use clap::Command;
use log::LevelFilter;
use std::io::Write;

fn cli() -> Command<'static> {
    Command::new("aidbox-cli")
        .about("Aidbox CLI tool")
        .subcommand_required(true)
        .arg_required_else_help(true)
        .allow_external_subcommands(true)
        .allow_invalid_utf8_for_external_subcommands(true)
        .subcommand(types::types_command())
        .subcommand(devbox::devbox_command())
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
                        "[{} {} {}]: {}",
                        Local::now().format("%Y-%m-%d %H:%M:%S"),
                        level_style.value(record.level()),
                        record.module_path().as_ref().unwrap().to_string(),
                        record.args()
                    )
                })
                .filter_level(LevelFilter::Info)
                .init();
            let matches = cli().get_matches();

            match matches.subcommand() {
                Some(("devbox", sub_matches)) => devbox::devbox_match(sub_matches).await,
                Some(("types", sub_matches)) => types::types_match(sub_matches).await,
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
