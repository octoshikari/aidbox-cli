use log::{error, info, warn};
use regex::RegexSet;
use reqwest::header::{ACCEPT, CONTENT_TYPE};
use reqwest::Client;
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;
use std::fs::{self, File};
use std::path::PathBuf;

type RpcModel = HashMap<String, Value>;

pub struct ConnectionConfig {
  pub base_url: String,
  pub username: String,
  pub secret: String,
}

pub struct BoxConfig {
  instance: Client,
  config: ConnectionConfig,
}
#[derive(Deserialize)]
pub struct RpcResultModel {
  model: RpcModel,
}
#[derive(Deserialize)]
pub struct RpcResult {
  result: RpcResultModel,
}

#[derive(Deserialize)]
pub struct RpcNamespaces {
  result: Vec<String>,
}

#[derive(Deserialize)]
pub struct RpcNamespaceItem {
  name: String,
}

#[derive(Deserialize)]
pub struct RpcNamespace {
  result: Vec<RpcNamespaceItem>,
}

#[derive(Deserialize)]
pub struct ConceptResource {
  code: Option<String>,
}

#[derive(Deserialize)]
pub struct SearchEntry {
  resource: ConceptResource,
}
#[derive(Deserialize)]
pub struct BoxSearch {
  entry: Vec<SearchEntry>,
}

impl BoxConfig {
  pub fn new(config: ConnectionConfig) -> BoxConfig {
    BoxConfig {
      instance: Client::new(),
      config,
    }
  }
  pub async fn load_all_symbols(&self, cache_path: PathBuf) -> Result<Vec<String>, Box<dyn Error>> {
    let mut target_path = cache_path.clone();
    target_path.push("symbols.json");

    if target_path.exists() {
      let json = fs::read_to_string(target_path.to_str().unwrap())?;
      let data: Vec<String> = serde_json::from_str(&json)?;
      if !data.is_empty() {
        warn!("Cached symbols will be used!!!");

        return Ok(data);
      } else {
        info!("Cached symbols file empty")
      }
    } else {
      info!("Cached symbols not found. We will load them");
    }

    let excluded_namespaces = RegexSet::new(&[
      r"^aidbox",
      r"^zenbox",
      r"^fhir",
      r"^zen$",
      r"^zen.fhir",
      r"\.value-set\.",
      r"\.search\.",
    ])
    .unwrap();

    let req = self
      .instance
      .post(format!("{}/rpc", &self.config.base_url))
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .body("{:method aidbox.zen/namespaces :params {}}")
      .header(CONTENT_TYPE, "application/edn")
      .header(ACCEPT, "application/json")
      .send();

    let source_str = match req.await {
      Ok(it) => it.text().await?,
      _ => "Error".to_string(),
    };
    let namespaces: RpcNamespaces = serde_json::from_str(&source_str)?;

    let mut symbols: Vec<String> = Vec::new();

    for item in namespaces
      .result
      .into_iter()
      .filter(|item| !excluded_namespaces.is_match(item))
    {
      let namespace_req = self
        .instance
        .post(format!("{}/rpc", &self.config.base_url))
        .basic_auth(&self.config.username, Some(&self.config.secret))
        .body(format!(
          "{{:method aidbox.zen/symbols :params {{:ns {}}}}}",
          item
        ))
        .header(CONTENT_TYPE, "application/edn")
        .header(ACCEPT, "application/json")
        .send();

      let namespace_str = match namespace_req.await {
        Ok(it) => it.text().await?,
        Err(err) => {
          error!("{:#?}", err);
          "Error".to_string()
        },
      };
      let namespace_items: RpcNamespace = serde_json::from_str(&namespace_str)?;
      for sym in namespace_items.result.into_iter() {
        symbols.push(format!("{}/{}", item, sym.name));
      }
    }
    if let Ok(..) = serde_json::to_writer(&File::create(target_path.to_str().unwrap())?, &symbols) {
      info!("Symbols load has been finished");
    };
    Ok(symbols)
  }

  pub async fn health_check(&self) -> Result<bool, reqwest::Error> {
    let result = self
      .instance
      .get(format!("{}/__healthcheck", &self.config.base_url))
      .send();

    return match result.await {
      Ok(it) => Ok(it.text().await.unwrap() == "healthy"),
      Err(error) => Err(error),
    };
  }

  pub async fn get_user_info(&self) -> Result<Value, String> {
    let result = self
      .instance
      .get(format!("{}/auth/userinfo", &self.config.base_url))
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .send();

    return match result.await {
      Ok(it) => match it.status().as_u16() {
        401 => Err("Access denied. Please check you credentials".to_string()),
        _ => Ok(it.json().await.unwrap()),
      },
      Err(error) => Err(error.to_string()),
    };
  }

  pub async fn psql(&self, data: String) -> Result<Value, String> {
    let mut query = HashMap::new();
    query.insert("query", data);

    let result = self
      .instance
      .post(format!("{}/$psql", &self.config.base_url))
      .json(&query)
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .send();

    return match result.await {
      Ok(it) => match it.status().as_u16() {
        401 => Err("Access denied. Please check you credentials".to_string()),
        _ => Ok(it.json().await.unwrap()),
      },
      Err(error) => Err(error.to_string()),
    };
  }

  pub async fn get_box_version(&self) -> Result<Value, String> {
    let result = self
      .instance
      .get(format!("{}/$version", &self.config.base_url))
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .send();

    return match result.await {
      Ok(it) => Ok(it.json().await.unwrap()),
      Err(err) => {
        println!("{:#?}", err);
        Err(
          "$version operation doesn't exist. Please update you aidbox on newer version".to_string(),
        )
      },
    };
  }

  pub async fn get_symbol(&self, symbol: &str) -> Result<HashMap<String, Value>, Box<dyn Error>> {
    let req = self
      .instance
      .post(format!("{}/rpc", &self.config.base_url))
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .body(format!(
        "{{:method aidbox.zen/symbol :params {{ :name {}}}}}",
        symbol
      ))
      .header(CONTENT_TYPE, "application/edn")
      .header(ACCEPT, "application/json")
      .send();

    let source_str = match req.await {
      Ok(it) => it.text().await?,
      _ => "Error".to_string(),
    };
    let result: RpcResult = serde_json::from_str(&source_str)?;

    Ok(result.result.model)
  }
  pub async fn get_concept(&self, symbol: &str) -> Result<Vec<String>, Box<dyn Error>> {
    let definition = self.get_symbol(symbol).await?;

    let concept_req = self
      .instance
      .get(format!(
        "{}/Concept?valueset={}",
        &self.config.base_url,
        str::replace(&definition.get("uri").unwrap().to_string(), "\"", "")
      ))
      .basic_auth(&self.config.username, Some(&self.config.secret))
      .header(ACCEPT, "application/json")
      .send();

    let concept_str = match concept_req.await {
      Ok(it) => it.text().await?,
      _ => "Error".to_string(),
    };
    let concept_result: BoxSearch = serde_json::from_str(&concept_str)?;
    let result: Vec<_> = concept_result
      .entry
      .iter()
      .map(|item| item.resource.code.as_ref())
      .filter(|item| item.is_some())
      .map(|item| item.unwrap().to_string())
      .collect();

    Ok(result)
  }
}

pub async fn create_box(config: ConnectionConfig) -> Result<BoxConfig, reqwest::Error> {
  let box_instance = BoxConfig::new(config);

  return match box_instance.health_check().await {
    Ok(..) => {
      info!("Box ready!");
      return Ok(box_instance);
    },
    Err(error) => Err(error),
  };
}
