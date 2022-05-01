use log::info;
use reqwest::Client;

pub struct ConnectionConfig {
    pub base_url: String,
    pub username: String,
    pub secret: String,
}

pub struct BoxInstance {
    instance: Client,
    config: ConnectionConfig,
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
}

// let mut headers = header::HeaderMap::new();

// let mut auth_value = header::HeaderValue::from_static(
//     format!("{}:{}", String::from("root"), String::from("secret")).as_str(),
// );

// auth_value.set_sensitive(true);

// headers.insert(reqwest::header::AUTHORIZATION, auth_value);
// try {
//     const { data } = await instance.get("/__healthcheck");
//     return data === "healthy";
//   } catch {
//     return false;
//   }
//
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
