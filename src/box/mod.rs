pub(crate) mod requests;

use crate::config::{BoxInstance, Config};
use crate::r#box::requests::{create_box, ConnectionConfig};
use clap::{ArgMatches, Command};
use dialoguer::{theme::ColorfulTheme, Input, Password};
use log::error;
use std::fmt::Debug;
use std::str::FromStr;

pub fn commands() -> Command<'static> {
    return Command::new("box")
        .about("Box instance")
        .arg_required_else_help(true)
        .subcommand(Command::new("configure").about("Initialize box config"))
        .subcommand(
            Command::new("unset")
                .about("Pull latest images from DockerHub")
                .arg_required_else_help(true)
                .args(vec![clap::Arg::new("target")
                    .short('t')
                    .value_name("TARGET")
                    .help("Devbox image tag")]),
        );
}

pub async fn matches(sub_matches: &ArgMatches) {
    let box_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match box_command {
        ("configure", sub_matches) => {
            let mut config = Config::new(sub_matches);
            let key = sub_matches.value_of("profile").unwrap();
            let (current_url, current_username, current_password) = match config.boxes.get(key) {
                Some(current_box) => (
                    Some(current_box.url.clone()),
                    Some(current_box.client.clone()),
                    Some(current_box.secret.clone()),
                ),
                None => (None, None, None),
            };

            let url = prompt::<String>("Aidbox URL", current_url);

            let username = prompt::<String>("ClientID", current_username);

            let password = Password::new()
                .allow_empty_password(current_password.is_some())
                .report(false)
                .with_prompt("Client secret")
                .interact()
                .unwrap();
            let target_password = match password.is_empty() {
                true => current_password.unwrap(),
                false => password,
            };
            let box_check = create_box(ConnectionConfig {
                base_url: url.clone(),
                username: username.clone(),
                secret: target_password.clone(),
            })
            .await;

            match box_check {
                Ok(instance) => match instance.get_user_info().await {
                    Ok(info) => config.update_boxes(
                        key.to_string(),
                        BoxInstance {
                            url,
                            client: username,
                            secret: target_password,
                            user_info: Some(info),
                            box_info: match instance.get_box_version().await {
                                Ok(it) => Some(it),
                                Err(err) => {
                                    error!("{}", err);
                                    None
                                }
                            },
                        },
                    ),
                    Err(err) => {
                        error!("{:?}", err);
                    }
                },
                Err(err) => {
                    error!("{:?}", err);
                }
            }
        }
        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
    }
}

fn prompt<T>(prompt: &str, default: Option<T>) -> T
where
    T: Clone + ToString + FromStr,
    <T as FromStr>::Err: Debug + ToString,
{
    let theme = &ColorfulTheme::default();
    let mut builder = Input::<T>::with_theme(theme);
    builder.with_prompt(prompt);

    if let Some(default) = default {
        builder.default(default);
    }

    builder.interact_text().unwrap()
}
