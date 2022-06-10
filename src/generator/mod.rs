use crate::config::default_config_arg;
use crate::generator::types::types_command;
use clap::{Arg, ArgMatches, Command};
use console::style;
use log::error;

use self::cache::cache_command;
use self::helpers::warm_up_definitions;
use self::types::generate;
use crate::r#box::matches::get_config_or_error;
use crate::r#box::requests::create_box;

use self::sample::{sample_commands, sample_match};

mod cache;
mod common;
pub mod helpers;
mod reader;
mod sample;
mod types;

pub fn commands() -> Command<'static> {
  return Command::new("generator")
    .about("Generate some useful things")
    .arg_required_else_help(true)
    .args(default_config_arg())
    .subcommand(types_command())
    .subcommand(sample_commands())
    .subcommand(
      Command::new("cache")
        .about("Cache commands")
        .arg_required_else_help(true)
        .subcommand(
          Command::new("stats")
            .about("Show cache statistic")
            .arg(Arg::new("all").long("all").help("Show all instance stats")),
        )
        .subcommand(
          Command::new("rm")
            .about("Remove specific or all cache item")
            .arg_required_else_help(true)
            .args(vec![
              Arg::new("all")
                .long("all")
                .help("Remove all cache items")
                .takes_value(false),
              Arg::new("key")
                .long("key")
                .conflicts_with("all")
                .help("Remove specific cache item")
                .possible_values(&[
                  "confirms",
                  "primitives",
                  "schema",
                  "valuesets",
                  "symbols",
                  "intermediate_types",
                ]),
            ]),
        ),
    );
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
  let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match box_command {
    ("types", sub_matches) => {
      if let Ok((config, key)) = get_config_or_error(sub_matches) {
        let box_config = config.boxes.get(key).unwrap();

        let box_check = create_box(box_config.to_owned()).await;

        match box_check {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              let mut cache_folder = config.clone().config_dir;
              cache_folder.push(".cache");
              cache_folder.push(key);

              generate(sub_matches, instance, config.config_dir, key).await;
              {};
            },
            Err(err) => {
              error!("{:?}", err);
            },
          },
          Err(err) => {
            error!("{:?}", err);
          },
        }
      } else {
        error!("Please run '{}'", style("box configure").cyan())
      }
    },
    ("cache", sub_matches) => cache_command(sub_matches),
    ("sample", sub_matches) => {
      if let Ok((config, key)) = get_config_or_error(sub_matches) {
        let box_config = config.boxes.get(key).unwrap();

        let box_check = create_box(box_config.to_owned()).await;

        match box_check {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              let mut cache_folder = config.clone().config_dir;
              cache_folder.push(".cache");
              cache_folder.push(key);

              warm_up_definitions(
                config.config_dir,
                instance,
                sub_matches.is_present("include-profiles"),
                sub_matches.value_of("instance").unwrap(),
              )
              .await
              .expect("Error in process zen schemas");
              sample_match(sub_matches, cache_folder).await;
              {}
            },
            Err(err) => {
              error!("{:?}", err);
            },
          },
          Err(err) => {
            error!("{:?}", err);
          },
        }
      } else {
        error!("Please run '{}'", style("box configure").cyan())
      }
    },
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
