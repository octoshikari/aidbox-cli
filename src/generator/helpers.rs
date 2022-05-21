use crate::generator::cache::{create_cache, Cache};
use crate::generator::reader::generate_types;
use crate::r#box::requests::BoxConfig;
use log::{error, info};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::path::PathBuf;
use std::process::exit;

pub async fn get_symbol(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  symbol: &String,
) -> Result<HashMap<String, Value>, Box<dyn Error>> {
  let exist = cache.schema.get(symbol);
  return if exist.is_some() {
    Ok(exist.unwrap().clone())
  } else {
    let definition = box_instance.get_symbol(symbol).await?;
    cache.schema.insert(symbol.to_string(), definition.clone());
    Ok(definition)
  };
}

pub async fn get_value_set(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  symbol: &str,
) -> Result<Vec<String>, Box<dyn Error>> {
  let exist = cache.value_sets.get(symbol);
  return if exist.is_some() {
    Ok(exist.unwrap().to_owned())
  } else {
    let definition = box_instance.get_concept(symbol).await?;
    cache
      .value_sets
      .insert(symbol.to_string(), definition.clone());
    Ok(definition)
  };
}

pub async fn get_confirms(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  confirms: Vec<&str>,
  resource_name: &str,
) -> Result<Vec<String>, Box<dyn Error>> {
  let mut result: HashSet<String> = HashSet::new();
  for confirm in confirms.into_iter() {
    let exist = cache.confirms.get(confirm);
    if exist.is_some() {
      result.insert(exist.unwrap().as_str().unwrap().to_string());
    } else {
      let element = match cache.schema.get(confirm) {
        None => {
          let definition = box_instance.get_symbol(confirm).await?;
          cache.schema.insert(confirm.to_string(), definition.clone());
          definition.to_owned()
        },
        Some(it) => it.to_owned(),
      };
      if element.get("fhir/polymorphic").is_none() {
        let name = get_name(&element);
        cache
          .confirms
          .insert(confirm.to_string(), serde_json::to_value(&name).unwrap());
        result.insert(name.to_string());
      } else {
        // TODO: Need understand how ot process this
      }
    }
  }
  Ok(
    result
      .iter()
      .map(|item| match "Resource" == item {
        true => format!("Resource<'{}'>", resource_name),
        _ => item.to_string(),
      })
      .collect(),
  )
}

pub fn wrap_key(source: &str) -> String {
  return if source.contains('-') {
    format!("'{}'", source)
  } else {
    source.to_string()
  };
}

pub fn convert_primitive(val: &str) -> String {
  match val {
    "zen/string" => String::from("string"),
    "zen/boolean" => String::from("boolean"),
    "zen/date" => String::from("string"),
    "zen/datetime" => String::from("string"),
    "zen/number" => String::from("number"),
    "zen/integer" => String::from("number"),
    _ => String::from("any"),
  }
}

pub fn is_persistent_any(definition: &HashMap<String, Value>) -> bool {
  return (definition.get("validation-type").is_some()
    && definition.get("validation-type").unwrap().as_str().unwrap() == "open")
    || (definition.get("values").is_some()
      && definition.get("values").unwrap().get("type").is_some()
      && definition
        .get("values")
        .unwrap()
        .get("type")
        .unwrap()
        .as_str()
        .unwrap()
        == "zen/any");
}

pub fn is_type_and_not_map(definition: &HashMap<String, Value>) -> bool {
  return definition.get("type").is_some()
    && definition.get("type").unwrap().as_str().unwrap() != "zen/map";
}

pub fn get_description(definition: &HashMap<String, Value>) -> Option<String> {
  match definition.get("zen/desc") {
    Some(it) => match it.is_string() {
      true => Some(it.as_str().unwrap().to_string()),
      false => None,
    },
    None => None,
  }
}

pub fn get_description_value(definition: &Value) -> Option<String> {
  match definition.get("zen/desc") {
    Some(it) => match it.is_string() {
      true => Some(it.as_str().unwrap().to_string()),
      false => None,
    },
    None => None,
  }
}

pub async fn init_confirms(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  resource_name: &str,
  definition: &HashMap<String, Value>,
) -> Result<Vec<String>, Box<dyn Error>> {
  match definition.get("confirms") {
    Some(it) => {
      get_confirms(
        box_instance,
        cache,
        it.as_array()
          .unwrap()
          .iter()
          .filter_map(|item| item.as_str())
          .collect(),
        resource_name,
      )
      .await
    },
    _ => Ok(vec![]),
  }
}

pub async fn init_reference_confirms_value(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  resource_name: &str,
  definition: &Value,
) -> Result<Vec<String>, Box<dyn Error>> {
  let sub_confirms: Vec<_> = definition
    .get("zen.fhir/reference")
    .unwrap()
    .as_object()
    .unwrap()
    .get("refers")
    .unwrap()
    .as_array()
    .unwrap()
    .iter()
    .map(|it| it.as_str().unwrap())
    .collect();

  get_confirms(box_instance, cache, sub_confirms, resource_name).await
}

pub async fn init_confirms_value(
  box_instance: &BoxConfig,
  cache: &mut Cache,
  resource_name: &str,
  definition: &Value,
) -> Result<Vec<String>, Box<dyn Error>> {
  match definition.get("confirms") {
    Some(it) => {
      get_confirms(
        box_instance,
        cache,
        it.as_array()
          .unwrap()
          .iter()
          .filter_map(|item| item.as_str())
          .collect(),
        resource_name,
      )
      .await
    },
    _ => Ok(vec![]),
  }
}

pub fn normalize_confirms(confirms: &[String], resource_name: &str) -> Option<Vec<String>> {
  return if confirms.is_empty() || (confirms.len() == 1 && confirms[0].as_str() == resource_name) {
    None
  } else {
    Some(
      confirms
        .iter()
        .filter(|item| item.as_str() != resource_name)
        .map(|item| item.to_string())
        .collect(),
    )
  };
}

pub fn capitalize(s: &str) -> String {
  let mut c = s.chars();
  match c.next() {
    None => String::new(),
    Some(f) => f.to_uppercase().chain(c).collect(),
  }
}

pub fn kebab_to_camel(item: &str) -> String {
  let v: Vec<_> = item
    .split('-')
    .enumerate()
    .map(|(idx, item)| {
      if idx == 0 {
        item.to_string()
      } else {
        capitalize(item)
      }
    })
    .collect();
  v.join("")
}

pub fn zen_path_to_name(def: &Value) -> String {
  let v: Vec<&str> = def.as_str().unwrap().split('/').collect();

  if v[1] != "schema" {
    return kebab_to_camel(v[1]);
  }
  return if !v[0].is_empty() {
    let ns_parts: Vec<_> = v[0].split('.').collect();
    kebab_to_camel(ns_parts.last().unwrap())
  } else {
    "unknown-name".to_string()
  };
}

pub fn get_name(element: &HashMap<String, Value>) -> String {
  if element.get("zen.fhir/type").is_some() {
    return element["zen.fhir/type"].as_str().unwrap().to_string();
  }
  if element.get("resourceType").is_some() {
    return element["resourceType"].as_str().unwrap().to_string();
  }
  zen_path_to_name(&element["zen/name"])
}

pub fn key_required(key: String, require: bool) -> String {
  if key.as_str() == "[key: string]" {
    return key;
  }
  match require {
    true => key,
    false => format!("{}?", key),
  }
}

pub async fn warm_up_definitions(
  config_dir: PathBuf,
  instance: BoxConfig,
  include_profiles: bool,
  instance_tag: &str,
) {
  let cache_init = create_cache(config_dir, instance_tag);
  let mut cache = match cache_init {
    Err(err) => {
      error!("Cache creating error: {:}", err.to_string());
      exit(0);
    },
    Ok(it) => {
      info!("Cache ready!");
      it
    },
  };
  let types = match generate_types(instance, &mut cache, include_profiles).await {
    Ok(it) => {
      info!("Intermediate types ready");
      it
    },
    Err(err) => {
      error!("{:#?}", err);
      exit(0);
    },
  };
  match cache.save_intermediate_types(&types) {
    Ok(..) | Err(..) => {},
  }
  match cache.save() {
    Ok(..) | Err(..) => {},
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use proptest::proptest;

  #[test]
  fn test_capitalize() {
    assert_eq!(capitalize("test"), "Test".to_string());
  }

  #[test]
  fn test_kebab_to_camel() {
    assert_eq!(
      kebab_to_camel("test-case-string"),
      "testCaseString".to_string()
    );
  }

  proptest! {
      #[test]
      fn capitalize_idempotent(s in "[a-z]{1,10}") {
          let result = capitalize(&s);

          assert_eq!(
              result,
              capitalize(result.as_str())
          )
      }
      #[test]
      fn test_key_required(s in "[a-z]{1,10}", require: bool) {
          let result = key_required(s.clone(), require);

          assert_eq!(
              result,
              key_required(s, require)
          )
      }
  }
}
