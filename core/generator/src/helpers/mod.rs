use crate::cache::Cache;
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use tool_aidbox::BoxClient;
use tool_common::kebab_to_camel;

pub async fn get_symbol(
  box_instance: &BoxClient,
  cache: &mut Cache,
  symbol: &String,
) -> Result<HashMap<String, Value>, String> {
  let exist = cache.schema.get(symbol);
  if exist.is_some() {
    Ok(exist.unwrap().clone())
  } else {
    let definition = match box_instance.get_symbol(symbol).await {
      Ok(it) => it,
      Err(e) => return Err(e.to_string()),
    };
    cache.schema.insert(symbol.to_string(), definition.clone());
    Ok(definition)
  }
}

pub async fn get_value_set(
  box_instance: &BoxClient,
  cache: &mut Cache,
  symbol: &str,
) -> Result<Vec<String>, Box<dyn Error>> {
  let exist = cache.value_sets.get(symbol);
  if exist.is_some() {
    Ok(exist.unwrap().to_owned())
  } else {
    let definition = box_instance.get_concept(symbol).await?;
    cache
      .value_sets
      .insert(symbol.to_string(), definition.clone());
    Ok(definition)
  }
}

pub async fn get_confirms(
  box_instance: &BoxClient,
  cache: &mut Cache,
  confirms: Vec<&str>,
  resource_name: &str,
) -> Result<Vec<String>, Box<dyn Error>> {
  let result = base_confirm_iter(box_instance, cache, confirms).await?;

  Ok(
    result
      .iter()
      .map(|item| match "Resource" == item.as_str() {
        true => format!("Resource<'{}'>", resource_name),
        _ => item.to_string(),
      })
      .collect(),
  )
}

async fn base_confirm_iter(
  box_instance: &BoxClient,
  cache: &mut Cache,
  confirms: Vec<&str>,
) -> Result<HashSet<String>, Box<dyn Error>> {
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
          definition
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
  Ok(result)
}

pub async fn get_confirms_value(
  box_instance: &BoxClient,
  cache: &mut Cache,
  confirms: Vec<&str>,
) -> Result<Vec<String>, Box<dyn Error>> {
  let result = base_confirm_iter(box_instance, cache, confirms).await?;
  Ok(Vec::from_iter(result))
}

pub fn wrap_key(source: &str) -> String {
  if source.contains('-') || source == "type" || source.contains('?') {
    format!("'{}'", source)
  } else {
    source.to_string()
  }
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

#[macro_export]
macro_rules! get_description {
  ($def:expr) => {
    match $def.get("zen/desc") {
      Some(it) => match it.is_string() {
        true => Some(it.as_str().unwrap().to_string()),
        false => None,
      },
      None => None,
    }
  };
}

pub async fn init_confirms(
  box_instance: &BoxClient,
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
          .filter_map(Value::as_str)
          .collect(),
        resource_name,
      )
      .await
    },
    _ => Ok(vec![]),
  }
}

pub async fn init_reference_confirms_value(
  box_instance: &BoxClient,
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
  box_instance: &BoxClient,
  cache: &mut Cache,
  definition: &Value,
) -> Result<Vec<String>, Box<dyn Error>> {
  match definition.get("confirms") {
    Some(it) => {
      get_confirms_value(
        box_instance,
        cache,
        it.as_array()
          .unwrap()
          .iter()
          .filter_map(|item| item.as_str())
          .collect(),
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
    let filtered: Vec<String> = confirms
      .iter()
      .filter(|item| item.as_str() != resource_name)
      .map(|item| item.to_string())
      .collect();

    match filtered.is_empty() {
      true => None,
      false => Some(filtered),
    }
  };
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

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_capitalize() {
    let m: HashMap<String, Value> = HashMap::new();
    get_description!(m);
  }
}
