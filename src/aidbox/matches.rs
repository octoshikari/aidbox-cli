use clap::ArgMatches;
use console::{style, Emoji};
use dialoguer::theme::ColorfulTheme;
use dialoguer::{Confirm, Input, Password};
use log::{error, info};
use std::collections::HashMap;
use std::fmt::Debug;
use std::str::FromStr;
use tool_aidbox::create_box;
use tool_config::{get_config_or_error, BoxConfig, BoxInstance, Config};

pub async fn configure(sub_matches: &ArgMatches) {
  let mut config = match Config::new(None) {
    Ok(c) => c,
    Err(err) => {
      error!("{}", err);
      std::process::exit(1)
    },
  };
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

  let target_password = if password.is_empty() {
    current_password.unwrap()
  } else {
    password
  };

  let box_check = create_box(BoxConfig {
    key: key.clone(),
    url: url.clone(),
    client: username.clone(),
    secret: target_password.clone(),
    tags: None,
  })
  .await;

  let (status, message) = match box_check {
    Ok(instance) => match instance.get_user_info().await {
      Ok(_) => {
        info!("Box auth success");
        (true, String::new())
      },
      Err(err) => {
        error!("Box auth check. Error: {}", err);
        (false, err)
      },
    },
    Err(err) => {
      error!("Box unhealthy. Error {}", err);
      (false, err)
    },
  };
  if status {
    config.add_box(
      key.to_string(),
      BoxInstance {
        url,
        client: username,
        secret: target_password,
        status,
        last_checked: Some(chrono::offset::Utc::now()),
        status_message: message,
        tags: None,
      },
      String::new(),
    );
  }
}

pub fn rm_instance_config(sub_matches: &ArgMatches) {
  if let Ok((mut config, key)) =
    get_config_or_error(sub_matches.get_one::<String>("instance").unwrap().as_str())
  {
    if Confirm::with_theme(&ColorfulTheme::default())
      .with_prompt(format!(
        "Do you want to continue and delete config for {} instance?",
        key
      ))
      .default(true)
      .interact()
      .expect("Confirm prompt error")
    {
      match config.rm_box(key) {
        Ok(..) => info!("Success delete!"),
        Err(er) => error!("{}", er),
      };
    }
  }
}

pub fn open_ui(sub_matches: &ArgMatches) {
  if let Ok((config, key)) =
    get_config_or_error(sub_matches.get_one::<String>("instance").unwrap().as_str())
  {
    let instance = config.boxes.get(key).unwrap();

    if webbrowser::open(instance.url.clone().as_str()).is_ok() {
      info!("Open {} in default browser...", instance.url.as_str());
    }
  }
}

pub async fn get_box_info(sub_matches: &ArgMatches) {
  if let Ok((mut config, key)) =
    get_config_or_error(sub_matches.get_one::<String>("instance").unwrap().as_str())
  {
    let box_config = config.boxes.get(key).unwrap();

    let box_check = create_box(BoxConfig {
      key: key.to_string(),
      url: box_config.url.clone(),
      client: box_config.client.clone(),
      secret: box_config.secret.clone(),
      tags: None,
    })
    .await;

    match box_check {
      Ok(instance) => match instance.get_user_info().await {
        Err(err) => {
          error!("Auth error: {}", err);
        },
        Ok(_) => match instance.get_box_version().await {
          Ok(result) => {
            for (key, value) in result.as_object().unwrap().iter() {
              println!(
                "{0: <20} {1} {2}",
                style(tool_common::capitalize(
                  key.as_str().replace('-', " ").as_str()
                ))
                .cyan(),
                Emoji("▶️", "->"),
                style(value.as_str().unwrap_or("").to_string()).italic()
              );
            }
          },
          Err(err) => {
            error!("Get box info error: {}", err);

            let mut new_config = box_config.clone();

            new_config.status = false;
            new_config.status_message = err;
            new_config.last_checked = Some(chrono::offset::Utc::now());

            config.add_box(key.to_string(), new_config, String::new());
          },
        },
      },
      Err(err) => {
        error!("Box unhealthy. {}", err);
      },
    }
  }
}

pub async fn instance_list(sub_matches: &ArgMatches) {
  let config = Config::new(None).unwrap();
  let mut new_boxes: HashMap<String, BoxInstance> = HashMap::new();
  let need_check = sub_matches.contains_id("check");

  if config.boxes.keys().len() > 0 {
    let mut result: Vec<String> = vec![];

    for (key, mut value) in config.boxes.clone() {
      if need_check {
        println!("Check {} instance...", style(key.clone()).cyan().bold());
        match create_box(BoxConfig {
          key: key.to_string(),
          url: value.url.clone(),
          client: value.client.clone(),
          secret: value.secret.clone(),
          tags: None,
        })
        .await
        {
          Ok(instance) => match instance.get_user_info().await {
            Ok(_) => {
              value.last_checked = Some(chrono::offset::Utc::now());
              value.status_message = String::new();
              value.status = true;
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
        "{0:<20} {1}  {2}",
        "Aidbox URL",
        Emoji("▶️", "->"),
        value.url
      ));
      result.push(format!(
        "{0:<20} {1}  {2}",
        "Last checked",
        Emoji("▶️", "->"),
        match value.last_checked {
          Some(d) => d.format("%c").to_string(),
          None => "Don't checked".to_string(),
        },
      ));
      result.push(format!(
        "{0:<20} {1}  {2}",
        "Status",
        Emoji("▶️", "->"),
        if value.status {
          style("Ok").green().bold()
        } else {
          style("Error").red().bold()
        }
      ));
      result.push(format!(
        "{0:<20} {1}  {2}",
        "Status message",
        Emoji("▶️", "->"),
        value.status_message,
      ));
    }

    println!("{}", result.join("\n"));

    if !new_boxes.is_empty() {
      let _res = config.save_on_disk(&new_boxes.clone());
    }
  } else {
    println!(
      "You instance list is empty! Please run {}",
      style("box configure").cyan().bold()
    );
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
