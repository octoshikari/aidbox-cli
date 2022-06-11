use bollard::image::CreateImageOptions;
use bollard::Docker;
use chrono::{DateTime, Utc};
use clap::{Arg, ArgMatches, Command};
use console::style;
use future::ready;
use futures_util::stream::TryStreamExt;
use indicatif::{ProgressBar, ProgressStyle};
use log::error;
use serde::{Deserialize, Deserializer};
use std::future;
use std::time::Duration;

pub fn docker_commands() -> Command<'static> {
  return Command::new("docker-image")
    .about("Aidbox docker image information")
    .arg_required_else_help(true)
    .args(vec![
      Arg::new("tag")
        .long("tag")
        .help("Image tag")
        .requires("image")
        .global(true)
        .possible_values(&["edge", "latest", "stable"]),
      Arg::new("image")
        .long("image")
        .global(true)
        .help("Image name")
        .requires("tag")
        .possible_values(&["devbox", "aidboxone", "multibox"]),
    ])
    .subcommand(
      Command::new("remote")
        .about("Compare image version on dockerhub with local")
        .arg_required_else_help(true),
    )
    .subcommand(
      Command::new("pull")
        .arg_required_else_help(true)
        .about("Pull image from DockerHub"),
    );
}

pub async fn docker_matches(sub_matches: &ArgMatches) {
  let devbox_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
  match devbox_command {
    ("remote", sub_matches) => check_latest_version_on_dockerhub(sub_matches).await,
    ("pull", sub_matches) => pull_latest_image_from_dockerhub(sub_matches).await,
    (name, _) => {
      unreachable!("Unsupported subcommand `{}`", name)
    },
  }
}

#[derive(Deserialize)]
struct TagInfo {
  #[serde(default, deserialize_with = "option_datefmt")]
  last_updated: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
struct TagResults {
  results: Vec<TagInfo>,
}

async fn check_latest_version_on_dockerhub(sub_matches: &ArgMatches) {
  let tag = sub_matches.value_of("tag").unwrap();
  let target_image = sub_matches.value_of("image").unwrap();

  let docker = match Docker::connect_with_socket_defaults() {
    Ok(it) => it,
    Err(_) => {
      error!("Cannot connect to docker");
      std::process::exit(0);
    },
  };

  if let Err(..) = docker.version().await {
    error!("Docker not running");
    std::process::exit(0);
  }

  let image = docker
    .inspect_image(format!("healthsamurai/{}:{}", target_image, tag).as_str())
    .await;

  if image.is_err() {
    println!(
      "{}",
      style(
        format!(
          "Local image doesn't exist: healthsamurai/{}:{}. You use ",
          target_image, tag
        )
        .as_str()
      )
      .cyan()
    );
    std::process::exit(0);
  }

  let res: TagResults = reqwest::get(format!(
    "https://hub.docker.com/v2/repositories/healthsamurai/{}/tags/?page_size=25&page=1&name={}",
    target_image, tag
  ))
  .await
  .expect("")
  .json()
  .await
  .expect("");

  let last_updated = res.results[0].last_updated.unwrap();

  let current_time = image
    .unwrap()
    .created
    .unwrap()
    .as_str()
    .parse::<DateTime<Utc>>()
    .unwrap();

  if (last_updated - current_time).num_minutes() > 10 {
    println!(
      "New image available. You can run 'aidbox-cli docker-image pull --image {} --tag {}'",
      style(target_image).cyan(),
      style(tag).magenta()
    );
  } else {
    println!("Your local image is actual");
  }
}

async fn pull_latest_image_from_dockerhub(sub_matches: &ArgMatches) {
  let tag = sub_matches.value_of("tag").unwrap();
  let target_image = sub_matches.value_of("image").unwrap();

  let docker = match Docker::connect_with_socket_defaults() {
    Ok(it) => it,
    Err(_) => {
      error!("Cannot connect to docker");
      std::process::exit(0);
    },
  };

  if let Err(..) = docker.version().await {
    error!("Docker not running");
    std::process::exit(0);
  }

  let pb = ProgressBar::new_spinner();
  pb.enable_steady_tick(Duration::from_millis(17));
  pb.set_style(
    ProgressStyle::with_template("{spinner:.blue} [{elapsed_precise}] {msg}")
      .unwrap()
      .tick_strings(&[
        "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "████████▁▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "██████████▁▁▁▁▁▁▁▁▁▁",
        "███████████▁▁▁▁▁▁▁▁▁",
        "█████████████▁▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁▁██████████████▁▁▁▁",
        "▁▁▁██████████████▁▁▁",
        "▁▁▁▁█████████████▁▁▁",
        "▁▁▁▁██████████████▁▁",
        "▁▁▁▁██████████████▁▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁▁██████████████",
        "▁▁▁▁▁▁██████████████",
        "▁▁▁▁▁▁▁█████████████",
        "▁▁▁▁▁▁▁█████████████",
        "▁▁▁▁▁▁▁▁████████████",
        "▁▁▁▁▁▁▁▁████████████",
        "▁▁▁▁▁▁▁▁▁███████████",
        "▁▁▁▁▁▁▁▁▁███████████",
        "▁▁▁▁▁▁▁▁▁▁██████████",
        "▁▁▁▁▁▁▁▁▁▁██████████",
        "▁▁▁▁▁▁▁▁▁▁▁▁████████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "████████▁▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "███████████▁▁▁▁▁▁▁▁▁",
        "████████████▁▁▁▁▁▁▁▁",
        "████████████▁▁▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁▁▁█████████████▁▁▁▁",
        "▁▁▁▁▁████████████▁▁▁",
        "▁▁▁▁▁████████████▁▁▁",
        "▁▁▁▁▁▁███████████▁▁▁",
        "▁▁▁▁▁▁▁▁█████████▁▁▁",
        "▁▁▁▁▁▁▁▁█████████▁▁▁",
        "▁▁▁▁▁▁▁▁▁█████████▁▁",
        "▁▁▁▁▁▁▁▁▁█████████▁▁",
        "▁▁▁▁▁▁▁▁▁▁█████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
      ]),
  );

  pb.set_message(format!(
    "Downloading {} ...",
    style(format!("healthsamurai/{}:{}", target_image, tag)).cyan()
  ));

  docker
    .create_image(
      Some(CreateImageOptions {
        from_image: format!("healthsamurai/{}:{}", target_image, tag).to_string(),
        ..Default::default()
      }),
      None,
      None,
    )
    .try_for_each(|_item| ready(Ok(())))
    .await
    .expect("");

  pb.finish_with_message(format!(
    "Image {} has been updated",
    style(format!("healthsamurai/{}:{}", target_image, tag).as_str()).cyan()
  ));
}

fn datefmt<'de, D>(deserializer: D) -> Result<DateTime<Utc>, D::Error>
where
  D: Deserializer<'de>,
{
  let s = String::deserialize(deserializer)?;
  s.parse::<DateTime<Utc>>().map_err(serde::de::Error::custom)
}

fn option_datefmt<'de, D>(deserializer: D) -> Result<Option<DateTime<Utc>>, D::Error>
where
  D: Deserializer<'de>,
{
  #[derive(Deserialize)]
  struct Wrapper(#[serde(deserialize_with = "datefmt")] DateTime<Utc>);

  let v = Option::deserialize(deserializer)?;
  Ok(v.map(|Wrapper(a)| a))
}
