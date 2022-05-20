use clap::{Arg, ArgMatches, Command};
use log::error;

use crate::generator::cache::cache_command;
use crate::generator::helpers::warm_up_definitions;
use crate::generator::types::{types_command, types_match};
use crate::r#box::matches::get_config_or_error;
use crate::r#box::requests::{create_box, ConnectionConfig};

mod cache;
pub mod helpers;
mod reader;
mod types;

pub fn commands() -> Command<'static> {
  return Command::new("generator")
      .about("Generate some useful things")
      .arg_required_else_help(true)
      .subcommand(types_command())
      .subcommand(Command::new("sample").about("Create sample resource"))
      .subcommand(Command::new("warm-up")
          .args(vec![Arg::new("include-profiles")
                         .long("include-profiles")
                         .takes_value(false)
                         .help("Include profiles")])
          .about("Preload and parse resource definition from box. Please use this command before other commands"))
      .subcommand(Command::new("cache").about("Cache commands").arg_required_else_help(true)
          .subcommand(Command::new("stats").about("Show cache statistic"))
          .subcommand(Command::new("rm").about("Remove specific or all cache item").arg_required_else_help(true)
              .args(vec![Arg::new("all")
                             .long("all")
                             .help("Remove all cache items")
                             .takes_value(false),
                         Arg::new("key")
                             .long("key")
                             .conflicts_with("all")
                             .help("Remove specific cache item")
                             .possible_values(&["confirms", "primitives", "schema", "valuesets", "symbols", "intermediate_types"])])));
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
  let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match box_command {
    ("types", sub_matches) => {
      if let Ok((config, key)) = get_config_or_error(sub_matches) {
        let box_config = config.boxes.get(key).unwrap();

        let box_check = create_box(ConnectionConfig {
          base_url: box_config.url.clone(),
          username: box_config.client.clone(),
          secret: box_config.secret.clone(),
        })
        .await;

        match box_check {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              let mut cache_folder = config.clone().config_dir;
              cache_folder.push(".cache");
              cache_folder.push(key);

              match cache_folder.exists() {
                true => types_match(sub_matches, instance, key, config).await,
                false => {
                  error!("Please run 'generator warm-up'");
                  std::process::exit(0);
                },
              };
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
        error!("Please run 'box configure'")
      }
    },
    ("cache", sub_matches) => cache_command(sub_matches),
    ("sample", _sub_matches) => {
      todo!();
    },
    ("warm-up", sub_matches) => {
      if let Ok((config, key)) = get_config_or_error(sub_matches) {
        let box_config = config.boxes.get(key).unwrap();

        let box_check = create_box(ConnectionConfig {
          base_url: box_config.url.clone(),
          username: box_config.client.clone(),
          secret: box_config.secret.clone(),
        })
        .await;

        match box_check {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              warm_up_definitions(
                config.config_dir,
                instance,
                sub_matches.is_present("include-profiles"),
                key,
              )
              .await
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
        error!("Please run 'box configure'")
      }
    },
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
