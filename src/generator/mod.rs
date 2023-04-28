mod types;
use crate::generator::types::generate;
use clap::ArgAction::SetFalse;
use clap::{Arg, ArgMatches, Command, ValueHint};
use console::{style, Emoji};
use indicatif::HumanBytes;
use log::error;
use tool_aidbox::create_box;
use tool_config::get_config_or_error;
use tool_generator::cache::Cache;

pub fn commands() -> Command {
  Command::new("generator")
    .about("Generator with helpers")
    .arg_required_else_help(true)
    .args(vec![Arg::new("instance")
      .long("instance")
      .global(true)
      .value_hint(ValueHint::DirPath)
      .help("Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)")
      .default_value("default")])
    .subcommand(types::commands())
    .subcommand(
      Command::new("cache")
        .about("Cache")
        .arg_required_else_help(true)
        .subcommand(Command::new("stats").about("Show cache statistic"))
        .subcommand(
          Command::new("rm")
            .about("Remove specific/all cache item(s)")
            .arg_required_else_help(true)
            .args(vec![
              Arg::new("all")
                .long("all")
                .action(SetFalse)
                .help("All items"),
              Arg::new("key")
                .long("key")
                .conflicts_with("all")
                .help("Specific item")
                .value_parser([
                  "confirms",
                  "primitives",
                  "schema",
                  "valuesets",
                  "symbols",
                  "intermediate_types",
                ]),
            ]),
        ),
    )
}

pub async fn sub_matches(sub_matches: &ArgMatches) {
  let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  let instance = sub_matches.get_one::<String>("instance").unwrap();

  match box_command {
    ("types", sub_matches) => {
      if let Ok((config, key)) = get_config_or_error(instance) {
        let box_config = config.boxes.get(key).unwrap();

        let box_check = create_box(box_config.clone().to_box_config(key.to_string())).await;

        match box_check {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              if let Err(e) = generate(sub_matches, instance, key).await {
                error!("{}", e);
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
        error!("Please run '{}'", style("box configure").cyan());
      }
    },
    ("cache", sub_matches) => {
      let types_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
      let cache = match Cache::default(instance.as_str()) {
        Ok(it) => it,
        Err(err) => {
          error!("{}", err);
          std::process::exit(1);
        },
      };
      match types_command {
        ("rm", sub_matches) => {
          let key = sub_matches.get_one::<String>("key").unwrap();
          let all = sub_matches.get_flag("all");
          if let Err(err) = cache.rm_cache_item(key, all) {
            error!("{}", err);
          }
        },
        ("stats", _) => {
          let result = cache.instance_stat();

          println!("{}:", style(instance).green().italic().bold().underlined());

          for item in result.items {
            println!(
              "{0: <30} {1} {2: <10}",
              item.path.split('/').last().unwrap(),
              Emoji("▶️", "->"),
              HumanBytes(item.size)
            );
          }
          println!(
            "{0: <30} {1} {2}",
            "Total item size: ",
            Emoji("▶️", "->"),
            style(HumanBytes(result.total)).green().italic()
          );
          println!();
        },
        (name, _) => {
          unreachable!("Unsupported subcommand `{}`", name)
        },
      }
    },
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}
