use clap::Command;
use dialoguer::theme::ColorfulTheme;
use dialoguer::Confirm;
use futures_util::StreamExt;
use indicatif::{ProgressBar, ProgressStyle};
use log::{error, info};
use reqwest::header::{ACCEPT, USER_AGENT};
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use std::cmp::min;
use std::env;
use std::fs::File;
use std::io::Write;
use version_compare::compare;
use version_compare::Cmp::Lt;

pub type Root = Vec<Root2>;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Root2 {
  pub url: String,
  #[serde(rename = "html_url")]
  pub html_url: String,
  #[serde(rename = "assets_url")]
  pub assets_url: String,
  #[serde(rename = "upload_url")]
  pub upload_url: String,
  #[serde(rename = "tarball_url")]
  pub tarball_url: String,
  #[serde(rename = "zipball_url")]
  pub zipball_url: String,
  pub id: i64,
  #[serde(rename = "node_id")]
  pub node_id: String,
  #[serde(rename = "tag_name")]
  pub tag_name: String,
  #[serde(rename = "target_commitish")]
  pub target_commitish: Option<String>,
  pub name: String,
  pub body: Option<String>,
  pub draft: bool,
  pub prerelease: bool,
  #[serde(rename = "created_at")]
  pub created_at: String,
  #[serde(rename = "published_at")]
  pub published_at: String,
  pub author: Author,
  pub assets: Vec<Asset>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Author {
  pub login: String,
  pub id: i64,
  #[serde(rename = "node_id")]
  pub node_id: String,
  #[serde(rename = "avatar_url")]
  pub avatar_url: String,
  pub url: String,
  #[serde(rename = "html_url")]
  pub html_url: String,
  #[serde(rename = "followers_url")]
  pub followers_url: String,
  #[serde(rename = "following_url")]
  pub following_url: String,
  #[serde(rename = "gists_url")]
  pub gists_url: String,
  #[serde(rename = "starred_url")]
  pub starred_url: String,
  #[serde(rename = "subscriptions_url")]
  pub subscriptions_url: String,
  #[serde(rename = "organizations_url")]
  pub organizations_url: String,
  #[serde(rename = "repos_url")]
  pub repos_url: String,
  #[serde(rename = "events_url")]
  pub events_url: String,
  #[serde(rename = "received_events_url")]
  pub received_events_url: String,
  #[serde(rename = "type")]
  pub type_field: String,
  #[serde(rename = "site_admin")]
  pub site_admin: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Asset {
  pub url: String,
  #[serde(rename = "browser_download_url")]
  pub browser_download_url: String,
  pub id: i64,
  #[serde(rename = "node_id")]
  pub node_id: String,
  pub name: String,
  pub label: Option<String>,
  pub state: Option<String>,
  #[serde(rename = "content_type")]
  pub content_type: String,
  pub size: i64,
  #[serde(rename = "download_count")]
  pub download_count: i64,
  #[serde(rename = "created_at")]
  pub created_at: String,
  #[serde(rename = "updated_at")]
  pub updated_at: String,
  pub uploader: Uploader,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Uploader {
  pub login: String,
  pub id: i64,
  #[serde(rename = "node_id")]
  pub node_id: String,
  #[serde(rename = "avatar_url")]
  pub avatar_url: String,
  #[serde(rename = "gravatar_id")]
  pub gravatar_id: Option<String>,
  pub url: String,
  #[serde(rename = "html_url")]
  pub html_url: String,
  #[serde(rename = "followers_url")]
  pub followers_url: String,
  #[serde(rename = "following_url")]
  pub following_url: String,
  #[serde(rename = "gists_url")]
  pub gists_url: String,
  #[serde(rename = "starred_url")]
  pub starred_url: String,
  #[serde(rename = "subscriptions_url")]
  pub subscriptions_url: String,
  #[serde(rename = "organizations_url")]
  pub organizations_url: String,
  #[serde(rename = "repos_url")]
  pub repos_url: String,
  #[serde(rename = "events_url")]
  pub events_url: String,
  #[serde(rename = "received_events_url")]
  pub received_events_url: String,
  #[serde(rename = "type")]
  pub type_field: String,
  #[serde(rename = "site_admin")]
  pub site_admin: bool,
}

pub fn commands() -> Command<'static> {
  return Command::new("update")
    .about("Self update. For move and set file permission we will ask your sudo password");
}

pub async fn update() {
  if cfg!(unix) {
    let current_version = env!("CARGO_PKG_VERSION");
    let repo = "https://api.github.com/repos/octoshikari/aidbox-cli";

    info!("Current version {}", current_version);

    info!("Checking latest version on Github");

    let request = Client::new()
      .get(format!("{}/releases?per_page=1", repo))
      .header(
        ACCEPT,
        header::HeaderValue::from_static("application/vnd.github.v3+json"),
      )
      .header(USER_AGENT, header::HeaderValue::from_static("octoshikari"))
      .send();

    let data = match request.await {
      Ok(it) => it.json::<Root>().await.expect(""),
      Err(err) => {
        error!(
          "Status: {}. Message: {}",
          err.status().unwrap(),
          err.to_string()
        );
        std::process::exit(1);
      },
    };
    let current = data.get(0).unwrap();
    let latest_version = current.tag_name.replace('v', "");
    if compare(current_version, &latest_version) == Ok(Lt) {
      if Confirm::with_theme(&ColorfulTheme::default())
        .with_prompt(format!("Do you want upgrade to {} ?", latest_version))
        .default(true)
        .interact()
        .unwrap()
      {
        let os = match env::consts::OS {
          "macos" => "darwin",
          "linux" => "linux",
          _ => "",
        };

        let arch = match env::consts::ARCH {
          "aarch64" => "m1",
          "x86_64" => "x86_64",
          _ => "",
        };

        let asset_name = format!(
          "{}-{}-{}-{}",
          env!("CARGO_PKG_NAME"),
          current.tag_name,
          os,
          arch
        );

        let target_asset_position = current
          .assets
          .iter()
          .position(|item| item.name == asset_name.clone());

        match target_asset_position {
          None => {
            error!("Target asset doesn't exist - {}", asset_name)
          },
          Some(pos) => {
            let asset = current.assets.get(pos).unwrap();
            let target_url = asset.browser_download_url.clone();
            let total_size = asset.size as u64;
            let res = Client::new()
              .get(target_url.clone())
              .send()
              .await
              .map_err(|_| format!("Failed to GET from '{}'", &target_url))
              .expect("");

            let pb = ProgressBar::new(total_size);
            pb.set_style(ProgressStyle::default_bar()
                .template("{msg}\n{spinner:.green} [{elapsed_precise}] [{bar:50.cyan/blue}] {bytes}/{total_bytes} ({bytes_per_sec}, {eta})")
                .unwrap()
                .progress_chars("#>-"));
            pb.set_message(format!("Downloading {}", target_url));

            let mut file = File::create("/tmp/aidbox-cli-new")
              .or(Err("Failed to create file '/tmp/aidbox-cli-new'"))
              .expect("");
            let mut downloaded: u64 = 0;
            let mut stream = res.bytes_stream();

            while let Some(item) = stream.next().await {
              let chunk = item.or(Err("Error while downloading file")).expect("");
              file
                .write_all(&chunk)
                .or(Err("Error while writing to file"))
                .expect("");
              let new = min(downloaded + (chunk.len() as u64), total_size);
              downloaded = new;
              pb.set_position(new);
            }

            pb.finish_with_message(format!("Downloaded {} to /tmp/aidbox-cli-new", target_url));

            let status = runas::Command::new("mv")
              .arg("/tmp/aidbox-cli-new")
              .arg("/usr/local/bin/aidbox-cli")
              .status()
              .expect("");
            if status.success() {
              info!("Successfully move binary!");
            }

            let status = runas::Command::new("chmod")
              .arg("0755")
              .arg("/usr/local/bin/aidbox-cli")
              .status()
              .expect("");

            if status.success() {
              info!("Successfully update permission!");
              info!("Version successfully updated to '{}'", latest_version);
            }
          },
        }
      }
    } else {
      info!("You have actual tool version!")
    }
  } else if cfg!(windows) {
    error!("Self Update doesn't support on Windows. Please update tool by npm")
  } else {
    error!("Self Update doesn't support unknown platform")
  };
}
