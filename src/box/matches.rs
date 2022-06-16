use crate::config::{save_on_disk, BoxInstance, Config};
use crate::r#box::requests::create_box;
use clap::ArgMatches;
use console::{style, Emoji};
use dialoguer::theme::ColorfulTheme;
use dialoguer::{Confirm, Input, Password};
use log::error;
use std::collections::HashMap;
use std::fmt::Debug;
use std::fs;
use std::str::FromStr;

pub async fn configure(sub_matches: &ArgMatches) {
  let mut config = Config::new(sub_matches);
  let key = sub_matches.get_one::<String>("instance").unwrap();
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

  let box_check = create_box(BoxInstance {
    url: url.clone(),
    client: username.clone(),
    secret: target_password.clone(),
    status: false,
    status_message: "".to_string(),
    last_checked: None,
    user_info: None,
    box_info: None,
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
          status: true,
          last_checked: Some(chrono::offset::Utc::now()),
          status_message: "".to_string(),
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

pub fn open_ui(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let instance = config.boxes.get(key).unwrap();

    match &instance.box_info {
      Some(_) => {
        if webbrowser::open(instance.url.clone().as_str()).is_ok() {
          println!("Open {} in default browser...", instance.url.as_str())
        }
      },
      None => eprintln!("User info doesn't exist. Please run - aidbox-cli box configure"),
    }
  }
}

pub fn get_box_info(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let instance = config.boxes.get(key).unwrap();

    match &instance.box_info {
      Some(info) => {
        for (key, value) in info.as_object().unwrap().iter() {
          println!(
            "{0: <20} {1} {2}",
            style(crate::helpers::capitalize(key)).cyan(),
            Emoji("▶️", "->"),
            style(value.as_str().unwrap_or("").to_string()).italic()
          );
        }
      },
      None => eprintln!(
        "Box info doesn't exist. Please run {}'",
        style("box configure").cyan()
      ),
    }
  }
}

pub async fn execute_sql(sub_matches: &ArgMatches) {
  if let Ok((config, key)) = get_config_or_error(sub_matches) {
    let file_path = *sub_matches.get_one::<&str>("file").unwrap();
    let box_config = config.boxes.get(key).unwrap();
    let file = fs::read_to_string(file_path);
    if file.is_err() {
      error!("{}", file.unwrap_err());
    } else {
      let sql_file = file.unwrap();

      let box_check = create_box(box_config.to_owned()).await;

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

pub async fn instance_list(sub_matches: &ArgMatches) {
  let config = Config::new(sub_matches);
  let mut new_boxes: HashMap<String, BoxInstance> = HashMap::new();

  if config.boxes.keys().len() > 0 {
    let need_check = sub_matches.contains_id("check");
    let mut result: Vec<String> = vec![];

    for (key, mut value) in config.boxes {
      if need_check {
        println!("Check {} instance...", style(key.clone()).cyan().bold());
        match create_box(value.clone()).await {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              value.last_checked = Some(chrono::offset::Utc::now());
            },
            Err(err) => {
              value.status = false;
              value.last_checked = Some(chrono::offset::Utc::now());
              value.status_message = err;
            },
          },
          Err(e) => {
            value.status = false;
            value.last_checked = Some(chrono::offset::Utc::now());
            value.status_message = e.to_string();
          },
        }
        new_boxes.insert(key.clone(), value.clone());
      }
      result.push(format!("{}:", style(key.clone()).green().bold().italic()));
      result.push(format!(
        "{0:<20} {1} {2}",
        "Aidbox URL",
        Emoji("▶️", "->"),
        value.url
      ));
      result.push(format!(
        "{0:<20} {1} {2}",
        "Last checked",
        Emoji("▶️", "->"),
        match value.last_checked {
          Some(d) => d.format("%c").to_string(),
          None => "Don't checked".to_string(),
        },
      ));
      result.push(format!(
        "{0:<20} {1} {2}",
        "Status",
        Emoji("▶️", "->"),
        match value.status {
          true => style("Ok").green().bold(),
          false => style("Error").red().bold(),
        }
      ));
      result.push(format!(
        "{0:<20} {1} {2}",
        "Status message",
        Emoji("▶️", "->"),
        value.status_message,
      ));
    }

    println!("{}", result.join("\n"));

    if !new_boxes.is_empty() {
      save_on_disk(config.config_file, new_boxes);
    }
  } else {
    println!(
      "You instance list is empty! Please run {}",
      style("box configure").cyan().bold()
    )
  }
}

pub fn get_config_or_error(sub_matches: &ArgMatches) -> Result<(Config, &str), String> {
  let key = sub_matches.get_one::<String>("instance").unwrap();
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
