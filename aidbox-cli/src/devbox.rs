use bollard::Docker;
use chrono::{DateTime, Utc};
use clap::{ArgMatches, Command};
use log::{error, info};
use serde::{Deserialize, Deserializer};
use std::io::{BufRead, BufReader};
use std::process::{Command as ProcessCommand, Stdio};
use which::which;

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

pub async fn devbox_match(sub_matches: &ArgMatches) -> () {
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
                Ok(..) => {}
                Err(..) => {}
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

fn find_binary(binary: &str) -> String {
    match which(binary) {
        Ok(bin) => bin.into_os_string().into_string().unwrap(),
        Err(e) => panic!("\"{:?}\" binary not found: {:?}", binary, e),
    }
}

async fn check_latest_version_on_dockerhub(tag: &String) -> Result<(), Box<dyn std::error::Error>> {
    let docker = Docker::connect_with_socket_defaults().unwrap();

    match docker.version().await {
        Ok(..) => {}
        Err(..) => {
            error!("Docker not running");
            std::process::exit(exitcode::OK);
        }
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
        "https://hub.docker.com/v2/repositories/healthsamurai/devbox/tags/?page_size=25&page=1&name=edge",
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

    match docker.version().await {
        Ok(..) => {
            let docker_binary: String = find_binary("docker");

            let mut cmd = ProcessCommand::new(docker_binary)
                .arg("pull")
                .arg(format!("healthsamurai/devbox:{}", tag).as_str())
                .stdout(Stdio::piped())
                .spawn()
                .unwrap();

            {
                let stdout = cmd.stdout.as_mut().unwrap();
                let stdout_reader = BufReader::new(stdout);
                let stdout_lines = stdout_reader.lines();

                for line in stdout_lines {
                    info!("{:?}", line.unwrap());
                }
            }

            cmd.wait().unwrap();
        }
        Err(..) => {
            error!("Docker not running");
            std::process::exit(exitcode::OK);
        }
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
