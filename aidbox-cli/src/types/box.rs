use log::info;
use regex::RegexSet;
use reqwest::header::{ACCEPT, CONTENT_TYPE};
use reqwest::Client;
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;
use std::fmt::Debug;

type RpcModel = HashMap<String, Value>;

pub struct ConnectionConfig {
    pub base_url: String,
    pub username: String,
    pub secret: String,
}

pub struct BoxInstance {
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

#[derive(Deserialize, Debug)]
pub struct ConceptResource {
    code: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct SearchEntry {
    resource: ConceptResource,
}
#[derive(Deserialize, Debug)]
pub struct BoxSearch {
    entry: Vec<SearchEntry>,
}

impl BoxInstance {
    pub fn new(config: ConnectionConfig) -> BoxInstance {
        BoxInstance {
            instance: Client::new(),
            config,
        }
    }
    pub async fn load_all_symbols(
        &self,
        cache: bool,
        cache_path: &str,
    ) -> Result<Vec<&str>, Box<dyn Error>> {
        let excluded_tags = [".search.", ".value-set."];

        let excluded_namespaces =
            RegexSet::new(&[r"^aidbox", r"^zenbox", r"^fhir", r"^zen$", r"^zen.fhir"]).unwrap();

        info!("{:#?}", excluded_namespaces);
        info!("{:#?}", excluded_tags);
        Ok(vec![""])
    }
    // if (useFromFileSystem) {
    //     if (fs.existsSync(cachePath + "/aidbox-symbols.json")) {
    //       try {
    //         const data: string[] = JSON.parse(
    //           fs.readFileSync(cachePath + "/aidbox-symbols.json").toString(),
    //         );
    //         if (data.length > 0) return data;
    //         else {
    //           boxLog("Saved symbols files empty");
    //         }
    //       } catch {
    //         boxLog("Saved symbols files empty");
    //       }
    //     } else {
    //       boxLog("Cached symbols not found. We will load them");
    //     }
    //   }
    //   const {
    //     data: { result: ns },
    //   }: { data: { result: string[] } } = await instance.post("/rpc", {
    //     method: "aidbox.zen/namespaces",
    //     params: {},
    //   });

    //   const namespaces = ns.filter(
    //     (namespace) =>
    //       !excludeNamespaces.some((symbol) => symbol.test(namespace)),
    //   );

    //   const symbols: string[] = [];

    //   for (const namespace of namespaces) {
    //     const {
    //       data: { result },
    //     } = await instance.post<{ result: { name: string }[] }>(
    //       "/rpc",
    //       `{:method aidbox.zen/symbols :params { :ns ${namespace}}}`,
    //       { headers: { "Content-Type": "application/edn" } },
    //     );
    //     result.map((r: { name: string }) =>
    //       symbols.push(`${namespace}/${r.name}`),
    //     );
    //   }

    //   const finalResult = symbols.filter(
    //     (s) => !excludedTags.some((exc) => s.startsWith(exc)),
    //   );

    //   fs.writeFileSync(
    //     cachePath + "/aidbox-symbols.json",
    //     JSON.stringify(finalResult),
    //   );

    //   return finalResult;

    pub async fn health_check(&self) -> Result<bool, reqwest::Error> {
        let result = self
            .instance
            .get(format!("{}/__healthcheck", &self.config.base_url))
            .basic_auth(&self.config.username, Some(&self.config.secret))
            .send();

        return match result.await {
            Ok(it) => Ok(it.text().await.unwrap() == "healthy"),
            Err(error) => Err(error),
        };
    }
    pub async fn get_symbol(
        &self,
        symbol: String,
    ) -> Result<HashMap<String, Value>, Box<dyn Error>> {
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

        return Ok(result.result.model);
    }
    pub async fn get_concept(&self, symbol: String) -> Result<Vec<String>, Box<dyn Error>> {
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
            .map(|item| item.clone().resource.code.as_ref())
            .filter(|item| item.is_some())
            .map(|item| item.unwrap().to_string())
            .collect();

        return Ok(result);
    }
}

pub async fn create_box(config: ConnectionConfig) -> Result<BoxInstance, reqwest::Error> {
    let box_instance = BoxInstance::new(config);

    return match box_instance.health_check().await {
        Ok(..) => {
            info!("Box ready!");
            return Ok(box_instance);
        }
        Err(error) => Err(error),
    };
}
