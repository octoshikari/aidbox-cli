use crate::config::{BoxInstance, Config};
use crate::r#box::requests::{create_box, ConnectionConfig};
use clap::ArgMatches;
use dialoguer::theme::ColorfulTheme;
use dialoguer::{Confirm, Input, Password};
use log::error;
use std::fmt::Debug;
use std::fs;
use std::str::FromStr;

pub async fn configure(sub_matches: &ArgMatches) {
  let mut config = Config::new(sub_matches);
  let key = sub_matches.value_of("instance").unwrap();
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

  let password = Password::with_theme(&ColorfulTheme::default())
    .allow_empty_password(current_password.is_some())
    .report(true)
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
            },
          },
        },
      ),
      Err(err) => {
        error!("{:?}", err);
      },
    },
    Err(err) => {
      error!("{:?}", err);
    },
  }
}

pub fn rm_instance_config(sub_matches: &ArgMatches) {
  if let Ok((mut config, key)) = get_config_or_error(sub_matches) {
    if Confirm::with_theme(&ColorfulTheme::default())
      .with_prompt(format!(
        "Do you want to continue and delete config for {} instance?",
        key
      ))
      .default(true)
      .interact()
      .expect("Confirm prompt error")
    {
      config.boxes.remove(key);
      config.save_on_disk();
    }
  }
}

pub fn get_user_info(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let instance = config.boxes.get(key).unwrap();

    match &instance.user_info {
      Some(info) => println!("{}", serde_json::to_string_pretty(info).unwrap()),
      None => eprintln!("User info doesn't exist. Please run --configure"),
    }
  }
}

pub fn get_box_info(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let instance = config.boxes.get(key).unwrap();

    match &instance.box_info {
      Some(info) => println!("{}", serde_json::to_string_pretty(info).unwrap()),
      None => eprintln!("Box info doesn't exist. Please run --configure"),
    }
  }
}

pub async fn execute_sql(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let file_path = sub_matches.value_of("file").unwrap();
    let box_config = config.boxes.get(key).unwrap();
    let file = fs::read_to_string(file_path);
    if file.is_err() {
      error!("{}", file.unwrap_err());
    } else {
      let sql_file = file.unwrap();

      let box_check = create_box(ConnectionConfig {
        base_url: box_config.url.clone(),
        username: box_config.client.clone(),
        secret: box_config.secret.clone(),
      })
      .await;

      match box_check {
        Ok(instance) => match instance.get_user_info().await {
          Ok(_) => match instance.psql(sql_file).await {
            Ok(it) => {
              println!("{}", serde_json::to_string_pretty(&it).unwrap())
            },
            Err(err) => {
              error!("{}", err)
            },
          },
          Err(err) => {
            error!("{:?}", err);
          },
        },
        Err(err) => {
          error!("{:?}", err);
        },
      }
    }
  }
}

pub fn get_config_or_error(sub_matches: &ArgMatches) -> Result<(Config, &str), String> {
  let key = sub_matches.value_of("instance").unwrap();
  let config = Config::new(sub_matches);
  if config.boxes.get(key).is_none() {
    error!("Instance config with key '{}' doesn't exist", key);
    Err(format!("Instance config with key '{}' doesn't exist", key))
  } else {
    Ok((config, key))
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
