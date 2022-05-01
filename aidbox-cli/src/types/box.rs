use log::{error, info};
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
    entry: Vec<Option<SearchEntry>>,
}

impl BoxInstance {
    pub fn new(config: ConnectionConfig) -> BoxInstance {
        BoxInstance {
            instance: Client::new(),
            config,
        }
    }
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
    pub async fn get_concept(&self, symbol: String) -> Result<(), Box<dyn Error>> {
        let definition = self.get_symbol(symbol).await?;

        info!(
            "{}",
            format!(
                "{}/Concept?valueset={}",
                &self.config.base_url,
                definition.get("uri").unwrap()
            )
        );
        let concept_req = self
            .instance
            .get(format!(
                "{}/Concept?valueset={}",
                &self.config.base_url,
                definition.get("uri").unwrap()
            ))
            .basic_auth(&self.config.username, Some(&self.config.secret))
            .header(ACCEPT, "application/json")
            .send();

        let concept_str = match concept_req.await {
            Ok(it) => it.text().await?,
            _ => "Error".to_string(),
        };
        let concept_result: BoxSearch = serde_json::from_str(&concept_str)?;
        info!("{:#?}", concept_result);
        return Ok(());
        // return Ok(concept_result.entry);
    }
}
// getConcept: async (symbol) => {
// const {
// data: {
// result: { model: definition },
// },
// } = await instance.post<{ result: { model: ZenSchema } }>(
// "/rpc",
// `{:method aidbox.zen/symbol :params { :name ${symbol}}}`,
// { headers: { "Content-Type": "application/edn" } },
// );
// const {
// data: { entry: concepts },
// } = await instance.get<{ entry: ConceptEntry[] }>(
// `/Concept?valueset=${definition.uri}`,
// );
//
// return (
// concepts
// ?.map((e: ConceptEntry) => e.resource?.code)
// .filter((item): item is string => !!item) || []
// );
// },

// export type Box = {
// loadAllSymbols: (
// excludeNamespaces: Array<RegExp>,
// excludedTags: string[],
// cachePath: string,
// useFromFileSystem?: boolean,
// ) => Promise<string[]>;
// getSymbol: (symbol: string) => Promise<ZenSchema>;
// getConcept: (symbol: string) => Promise<string[]>;
// };

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
