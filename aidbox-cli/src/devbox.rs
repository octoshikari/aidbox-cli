use bollard::image::CreateImageOptions;
use bollard::Docker;
use chrono::{DateTime, Utc};
use clap::{ArgMatches, Command};
use future::ready;
use futures_util::stream::TryStreamExt;
use log::{error, info};
use serde::{Deserialize, Deserializer};
use std::future;

pub fn devbox_command() -> Command<'static> {
    return Command::new("devbox")
        .about("Work with devbox installation")
        .arg_required_else_help(true)
        .subcommand(
            Command::new("check-latest-version")
                .about("Check latest devbox version on dockerhub")
                .arg_required_else_help(true)
                .args(vec![clap::Arg::new("target")
                    .short('t')
                    .value_name("TARGET")
                    .help("Devbox image tag")
                    .possible_values(&["edge", "latest", "stable"])]),
        )
        .subcommand(
            Command::new("update")
                .about("Pull latest images from DockerHub")
                .arg_required_else_help(true)
                .args(vec![clap::Arg::new("target")
                    .short('t')
                    .value_name("TARGET")
                    .help("Devbox image tag")
                    .possible_values(&["edge", "latest", "stable"])]),
        );
}

pub async fn devbox_match(sub_matches: &ArgMatches) {
    let devbox_command = sub_matches.subcommand().unwrap_or(("help", sub_matches));
    match devbox_command {
        ("check-latest-version", sub_matches) => {
            match check_latest_version_on_dockerhub(
                sub_matches
                    .value_of("target")
                    .map(str::to_string)
                    .as_ref()
                    .unwrap(),
            )
            .await
            {
                Ok(..) => {}
                Err(..) => {}
            }
        }
        ("update", sub_matches) => {
            match pull_latest_image_from_dockerhub(
                sub_matches
                    .value_of("target")
                    .map(str::to_string)
                    .as_ref()
                    .unwrap(),
            )
            .await
            {
                _ => {}
            }
        }

        (name, _) => {
            unreachable!("Unsupported subcommand `{}`", name)
        }
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

async fn check_latest_version_on_dockerhub(tag: &String) -> Result<(), Box<dyn std::error::Error>> {
    let docker = Docker::connect_with_socket_defaults().unwrap();

    match docker.version().await {
        Err(..) => {
            error!("Docker not running");
            std::process::exit(exitcode::OK);
        }
        _ => {}
    }

    let image = docker
        .inspect_image(format!("healthsamurai/devbox:{}", tag).as_str())
        .await;

    if image.is_err() {
        error!(
            "{}",
            format!("No such image: healthsamurai/devbox:{}", tag).as_str()
        );
        std::process::exit(exitcode::OK);
    }

    let res: TagResults = reqwest::get(
        format!("https://hub.docker.com/v2/repositories/healthsamurai/devbox/tags/?page_size=25&page=1&name={}", tag),
    ).await?.json().await?;

    let last_updated = res.results[0].last_updated.unwrap();

    let current_time = image
        .unwrap()
        .created
        .unwrap()
        .as_str()
        .parse::<DateTime<Utc>>()
        .unwrap();

    if (last_updated - current_time).num_minutes() > 10 {
        info!("New  healthsamurai/devbox:{} image available", tag)
    } else {
        info!("Your have actual healthsamurai/devbox:{} image", tag)
    }

    Ok(())
}

async fn pull_latest_image_from_dockerhub(tag: &String) -> Result<(), Box<dyn std::error::Error>> {
    let docker = Docker::connect_with_socket_defaults().unwrap();

    if let Ok(..) = docker.version().await {
        info!(
            "Image update {} has been started",
            format!("healthsamurai/devbox:{}", tag).to_string()
        );
        docker
            .create_image(
                Some(CreateImageOptions {
                    from_image: format!("healthsamurai/devbox:{}", tag).to_string(),
                    ..Default::default()
                }),
                None,
                None,
            )
            .try_for_each(|item| {
                if item.id.is_some() && item.progress.is_some() {
                    info!("{:#?} {:#?}", item.id.unwrap(), item.progress.unwrap());
                }
                ready(Ok(()))
            })
            .await?;

        info!(
            "Image {} has been updated",
            format!("healthsamurai/devbox:{}", tag).to_string()
        );
    } else {
        error!("Docker not running");
        std::process::exit(exitcode::OK);
    }

    Ok(())
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
