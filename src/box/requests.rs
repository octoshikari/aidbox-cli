use log::{error, info, warn};
use regex::RegexSet;
use reqwest::header::{ACCEPT, CONTENT_TYPE};
use reqwest::{Client, Response};
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;
use std::fs;
use std::future::Future;
use std::path::PathBuf;

use crate::config::BoxInstance;
use crate::generator::common::ExcludeConfig;

type RpcModel = HashMap<String, Value>;

pub struct BoxClient {
  instance: Client,
  base_url: String,
  user: String,
  password: String,
}
#[derive(Deserialize)]
pub struct RpcResultModel {
  model: RpcModel,
}
#[derive(Deserialize)]
pub struct RpcResult {
  result: RpcResultModel,
}

#[derive(Deserialize, Debug)]
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

impl BoxClient {
  pub fn new(config: BoxInstance) -> BoxClient {
    BoxClient {
      instance: Client::new(),
      base_url: config.url,
      user: config.client,
      password: config.secret,
    }
  }
  pub async fn load_all_symbols(
    &self,
    cache_path: PathBuf,
    exclude: ExcludeConfig,
  ) -> Result<Vec<String>, Box<dyn Error>> {
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
      r"^zenbox",
      r"^lisp",
      r"aidbox.metrics",
      r"fhir$",
      r"^zen$",
      r"^zen.fhir",
      r"\.value-set\.",
      r"\.search\.",
      r"^aidbox.sdc",
      r"^aidbox.notebooks",
      r"^aidbox.mock",
    ])
    .unwrap();

    let excluded_symbols: Vec<String> = vec![
      "aidbox/Configuration".to_string(),
      "aidbox/config".to_string(),
      "aidbox/devbox-config".to_string(),
      "aidbox/http".to_string(),
      "aidbox/nested-schema".to_string(),
      "aidbox/seed".to_string(),
      "aidbox/service".to_string(),
      "aidbox/system".to_string(),
      "aidbox.rest.v1/base-op".to_string(),
      "aidbox.rest.acl/base-operation".to_string(),
      "aidbox.rest.acl/sql-params".to_string(),
      "aidbox.rest.acl/filter-expression".to_string(),
      "aidbox.rest/.api-op".to_string(),
      "aidbox.rest/op".to_string(),
    ];

    let user_exclude_ns = match exclude.ns {
      Some(ns) => ns,
      None => vec![],
    };

    let user_exclude_symbols = match exclude.symbols {
      Some(sym) => sym,
      None => vec![],
    };

    let req = self
      .instance
      .post(format!("{}/rpc", &self.base_url))
      .basic_auth(&self.user, Some(&self.password))
      .body("{:method aidbox.zen/namespaces :params {}}")
      .header(CONTENT_TYPE, "application/edn")
      .header(ACCEPT, "application/json")
      .send();

    let source_str = match req.await {
      Ok(it) => it.text().await?,
      Err(_) => "Error".to_string(),
    };

    let namespaces: RpcNamespaces = serde_json::from_str(&source_str)?;

    let mut symbols: Vec<String> = Vec::new();

    for item in namespaces
      .result
      .into_iter()
      .filter(|item| !excluded_namespaces.is_match(item))
      .filter(|item| !user_exclude_ns.contains(item))
    {
      let namespace_req = self
        .instance
        .post(format!("{}/rpc", &self.base_url))
        .basic_auth(&self.user, Some(&self.password))
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
        let symbol_name = format!("{}/{}", item, sym.name);
        if !excluded_symbols.contains(&symbol_name) && !user_exclude_symbols.contains(&symbol_name)
        {
          symbols.push(symbol_name);
        }
      }
    }
    if let Ok(..) =
      serde_json::to_writer(&fs::File::create(target_path.to_str().unwrap())?, &symbols)
    {
      info!("Symbols load has been finished");
    };
    Ok(symbols)
  }

  pub async fn health_check(&self) -> Result<bool, reqwest::Error> {
    let result = self
      .instance
      .get(format!("{}/__healthcheck", &self.base_url))
      .send();

    return match result.await {
      Ok(it) => Ok(it.text().await.unwrap() == "healthy"),
      Err(error) => Err(error),
    };
  }

  pub async fn get_user_info(&self) -> Result<Value, String> {
    let result = self
      .instance
      .get(format!("{}/auth/userinfo", &self.base_url))
      .basic_auth(&self.user, Some(&self.password))
      .send();

    result_process(result).await
  }

  pub async fn psql(&self, data: String) -> Result<Value, String> {
    let mut query = HashMap::new();
    query.insert("query", data);

    let result = self
      .instance
      .post(format!("{}/$psql", &self.base_url))
      .json(&query)
      .basic_auth(&self.user, Some(&self.password))
      .send();

    result_process(result).await
  }

  pub async fn get_box_version(&self) -> Result<Value, String> {
    let result = self
      .instance
      .get(format!("{}/$version", &self.base_url))
      .basic_auth(&self.user, Some(&self.password))
      .send();

    return match result.await {
      Ok(it) => match it.status().as_u16() {
        401 => Err("Access denied. Please check you credentials".to_string()),
        403 => Err(format!(
          "Please check Access Policy for client '{}'",
          self.user
        )),
        _ => Ok(it.json().await.unwrap()),
      },

      Err(err) => {
        error!("Get box version error: {}", err.to_string());
        Err(
          "$version operation doesn't exist. Please update you aidbox on newer version".to_string(),
        )
      },
    };
  }

  pub async fn get_symbol(&self, symbol: &str) -> Result<HashMap<String, Value>, Box<dyn Error>> {
    let req = self
      .instance
      .post(format!("{}/rpc", &self.base_url))
      .basic_auth(&self.user, Some(&self.password))
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
        &self.base_url,
        str::replace(&definition.get("uri").unwrap().to_string(), "\"", "")
      ))
      .basic_auth(&self.user, Some(&self.password))
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

async fn result_process(
  result: impl Future<Output = Result<Response, reqwest::Error>> + Sized,
) -> Result<Value, String> {
  return match result.await {
    Ok(it) => match it.status().as_u16() {
      401 => Err("Access denied. Please check you credentials".to_string()),
      _ => Ok(it.json().await.unwrap()),
    },
    Err(error) => Err(error.to_string()),
  };
}

pub async fn create_box(config: BoxInstance) -> Result<BoxClient, reqwest::Error> {
  let box_instance = BoxClient::new(config);

  return match box_instance.health_check().await {
    Ok(..) => {
      return Ok(box_instance);
    },
    Err(error) => Err(error),
  };
}
