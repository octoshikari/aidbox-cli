use crate::types::cache::create_cache;
use clap::ArgMatches;
use exitcode::OK;
use log::{error, info};
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

async fn create_box(config: ConnectionConfig) -> Result<BoxInstance, reqwest::Error> {
    let box_instance = BoxInstance::new(config);

    return match box_instance.health_check().await {
        Ok(it) => {
            info!("Box ready!");
            return Ok(box_instance);
        }
        Err(error) => Err(error),
    };
}

pub async fn generate(sub_matches: &ArgMatches) -> () {
    let user = sub_matches.value_of("user").unwrap();
    let url = sub_matches.value_of("box").unwrap();
    let secret = sub_matches.value_of("secret").unwrap();

    let _box_instance = match create_box(ConnectionConfig {
        base_url: url.to_string(),
        username: user.to_string(),
        secret: secret.to_string(),
    })
    .await
    {
        Ok(it) => it,
        Err(error) => {
            error!("{}", error.to_string());
            std::process::exit(OK);
        }
    };
    let cache = create_cache(
        sub_matches.is_present("cache"),
        sub_matches
            .value_of("cache-folder")
            .as_ref()
            .unwrap()
            .to_string(),
    );
    match cache {
        Err(err) => {
            error!("Cache creating error: {:}", err.to_string());
            std::process::exit(OK);
        }
        Ok(..) => info!("Cache ready!"),
    }
}
