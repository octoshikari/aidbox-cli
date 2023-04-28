use crate::cache::Cache;
use crate::get_description;
use crate::helpers::{
  convert_primitive, get_name, get_symbol, get_value_set, init_confirms, init_confirms_value,
  init_reference_confirms_value, is_persistent_any, is_type_and_not_map, normalize_confirms,
  wrap_key, zen_path_to_name,
};
use async_recursion::async_recursion;
use async_stream::stream;
use itertools::Itertools;
use serde_json::Value;
use std::collections::HashMap;
use std::marker::Sync;
use std::process;
use tool_aidbox::BoxClient;
use tool_common::capitalize;
use tool_config::ExcludeConfig;

use super::common::{Element, ElementSchema, ElementWrapper};

#[async_recursion]
async fn read_vector(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  value: &Value,
  log_handler: &(impl Fn(String) + Sync),
) -> Result<ElementSchema, String> {
  let description = get_description!(value);

  if value.get("every").is_none() {
    return Ok(ElementSchema {
      extends: None,
      is_array: true,
      is_reference: false,
      require: false,
      description,
      sub_type: None,
      plain_type: None,
      values: None,
    });
  }

  let every = value.get("every").unwrap();
  let confirms = match init_confirms_value(box_instance, cache, every).await {
    Ok(it) => it,
    Err(e) => {
      return Err(e.to_string());
    },
  };

  if every.get("zen.fhir/value-set").is_some() {
    let values = match get_value_set(
      box_instance,
      cache,
      every
        .get("zen.fhir/value-set")
        .unwrap()
        .get("symbol")
        .unwrap()
        .as_str()
        .unwrap(),
    )
    .await
    {
      Ok(it) => it,
      Err(e) => return Err(e.to_string()),
    };
    if every.get("confirms").is_some() {
      let confirm = match init_confirms_value(box_instance, cache, every).await {
        Ok(it) => it,
        Err(e) => return Err(e.to_string()),
      };

      let single_confirm = confirm.get(0);
      if let Some(..) = single_confirm {
        if single_confirm.unwrap() == "code" {
          if values.is_empty() {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: Some("code".to_string()),
              values: None,
            })
          } else {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: None,
              values: Some(values),
            })
          }
        } else if single_confirm.unwrap() == "CodeableConcept" {
          if values.is_empty() {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: Some("CodeableConcept".to_string()),
              values: None,
            })
          } else {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: Some("CodeableConcept".to_string()),
              values: Some(values),
            })
          }
        } else if single_confirm.unwrap() == "Coding" {
          if values.is_empty() {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: Some("Coding".to_string()),
              values: None,
            })
          } else {
            Ok(ElementSchema {
              extends: None,
              is_array: true,
              is_reference: false,
              require: false,
              description,
              sub_type: None,
              plain_type: Some("Coding".to_string()),
              values: Some(values),
            })
          }
        } else {
          println!("wtf {:#?} - {:#?}", every, confirm);
          process::exit(0);
        }
      } else {
        println!("wtf2 {:#?} - {:#?}", every, confirm);
        process::exit(0);
      }
    } else {
      Ok(ElementSchema {
        extends: None,
        is_array: true,
        is_reference: false,
        require: false,
        description,
        sub_type: None,
        plain_type: None,
        values: None,
      })
    }
  } else if every
    .get("zen.fhir/reference")
    .map(|it| it.as_object())
    .map(|it| it.unwrap())
    .map(|it| it.get("refers"))
    .is_some()
  {
    let refers =
      match init_reference_confirms_value(box_instance, cache, resource_name, every).await {
        Ok(it) => it,
        Err(e) => return Err(e.to_string()),
      };
    let (plain_type, values) = match refers.is_empty() {
      false => (None, Some(refers)),
      true => (Some("Reference".to_string()), None),
    };
    Ok(ElementSchema {
      extends: None,
      is_array: true,
      is_reference: true,
      require: false,
      description,
      sub_type: None,
      plain_type,
      values,
    })
  } else if every.get("type").is_some() {
    let vector_type = every.get("type").unwrap().as_str().unwrap();

    if vector_type == "zen/map" {
      if every.get("validation-type").is_some()
        && every.get("validation-type").unwrap().as_str().unwrap() == "open"
      {
        let mut sub = HashMap::new();

        sub.insert(
          "__".to_string(),
          ElementSchema {
            extends: None,
            is_array: false,
            is_reference: false,
            require: false,
            description: get_description!(value),
            sub_type: None,
            plain_type: None,
            values: None,
          },
        );
        Ok(ElementSchema {
          extends: Some(confirms),
          is_array: true,
          is_reference: false,
          require: false,
          description,
          sub_type: Some(sub),
          plain_type: None,
          values: None,
        })
      } else if every.get("keys").is_some() {
        let sub_type = match read_map(
          box_instance,
          cache,
          resource_name,
          every.get("keys").unwrap(),
          every.get("require"),
          log_handler,
        )
        .await
        {
          Ok(it) => it,
          Err(e) => return Err(e),
        };

        Ok(ElementSchema {
          extends: Some(confirms),
          is_array: true,
          is_reference: false,
          require: false,
          description,
          sub_type: Some(sub_type),
          plain_type: None,
          values: None,
        })
      } else {
        let mut sub = HashMap::new();

        sub.insert(
          "__".to_string(),
          ElementSchema {
            extends: None,
            is_array: false,
            is_reference: false,
            require: false,
            description: get_description!(value),
            sub_type: None,
            plain_type: None,
            values: None,
          },
        );
        Ok(ElementSchema {
          extends: Some(confirms),
          is_array: true,
          is_reference: false,
          require: false,
          description,
          sub_type: Some(sub),
          plain_type: None,
          values: None,
        })
      }
    } else if vector_type == "zen/string" || vector_type == "zen/keyword" {
      let (plain_type, values) = match every.get("enum") {
        Some(it) => {
          let sub_target: Vec<_> = it
            .as_array()
            .unwrap()
            .iter()
            .map(|item| item.get("value").unwrap().as_str().unwrap().to_string())
            .collect();
          if sub_target.is_empty() {
            (Some("string".to_string()), None)
          } else {
            (None, Some(sub_target))
          }
        },
        None => (Some("string".to_string()), None),
      };
      Ok(ElementSchema {
        extends: Some(confirms),
        is_array: true,
        is_reference: false,
        require: false,
        description,
        sub_type: None,
        plain_type,
        values,
      })
    } else if vector_type == "zen/vector" {
      match read_vector(box_instance, cache, resource_name, every, log_handler).await {
        Ok(it) => Ok(it),
        Err(e) => Err(e),
      }
    } else if vector_type == "zen/integer" {
      Ok(ElementSchema {
        extends: Some(confirms),
        is_array: true,
        is_reference: false,
        require: false,
        description,
        sub_type: None,
        plain_type: Some("integer".to_string()),
        values: None,
      })
    } else if vector_type == "zen/keyword" {
      Ok(ElementSchema {
        extends: Some(confirms),
        is_array: true,
        is_reference: false,
        require: false,
        description,
        sub_type: None,
        plain_type: Some("string".to_string()),
        values: None,
      })
    } else {
      println!("Vector nested unparsed type {}", every);
      process::exit(0);
    }
  } else {
    Ok(ElementSchema {
      extends: Some(confirms),
      is_array: true,
      is_reference: false,
      require: false,
      description,
      sub_type: None,
      plain_type: None,
      values: None,
    })
  }
}

#[async_recursion]
async fn read_map(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  keys: &Value,
  require_keys: Option<&'async_recursion Value>,
  log_handler: &(impl Fn(String) + Sync),
) -> Result<HashMap<String, ElementSchema>, String> {
  let mut result_map: HashMap<String, ElementSchema> = HashMap::new();

  let required: Vec<String> = match require_keys {
    Some(item) => match item.as_array() {
      Some(it) => it
        .iter()
        .map(|item| item.as_str())
        .filter(|item| item.is_some())
        .map(|item| item.unwrap().to_string())
        .collect(),
      _ => vec![],
    },
    _ => vec![],
  };

  for (key, value) in keys.as_object().unwrap() {
    if value.get("zen.fhir/value-set").is_some() {
      let values = match get_value_set(
        box_instance,
        cache,
        value
          .get("zen.fhir/value-set")
          .unwrap()
          .get("symbol")
          .unwrap()
          .as_str()
          .unwrap(),
      )
      .await
      {
        Ok(it) => it,
        Err(e) => return Err(e.to_string()),
      };

      let (plain_type, values) = match values.is_empty() {
        true => {
          let confirms = match init_confirms_value(box_instance, cache, value).await {
            Ok(it) => it,
            Err(e) => return Err(e.to_string()),
          };
          match confirms.is_empty() {
            false => (None, Some(confirms)),
            true => (Some("any".to_string()), None),
          }
        },
        false => (None, Some(values)),
      };

      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description!(value),
          sub_type: None,
          plain_type,
          values,
        },
      );
    } else if value
      .get("zen.fhir/reference")
      .map(|it| it.as_object())
      .map(|it| it.unwrap())
      .map(|it| it.get("refers"))
      .is_some()
    {
      let refers =
        match init_reference_confirms_value(box_instance, cache, resource_name, value).await {
          Ok(it) => it,
          Err(e) => return Err(e.to_string()),
        };
      let (plain_type, values) = match refers.is_empty() {
        false => (None, Some(refers)),
        true => (Some("Reference".to_string()), None),
      };

      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: true,
          require: required.contains(key),
          description: get_description!(value),
          sub_type: None,
          plain_type,
          values,
        },
      );
    } else if value.get("type").is_none() && value.get("confirms").is_some() {
      let confirms = match init_confirms_value(box_instance, cache, value).await {
        Ok(it) => it,
        Err(e) => return Err(e.to_string()),
      };

      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: Some(confirms),
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description!(value),
          sub_type: None,
          plain_type: None,
          values: None,
        },
      );
    } else if value.get("type").is_some() {
      let source_type = value.get("type").unwrap().as_str().unwrap();
      let value_confirms = match init_confirms_value(box_instance, cache, value).await {
        Ok(it) => it,
        Err(e) => return Err(e.to_string()),
      };

      if source_type == "zen/vector" {
        let mut schema =
          match read_vector(box_instance, cache, resource_name, value, log_handler).await {
            Ok(it) => it,
            Err(e) => return Err(e),
          };

        schema.require = required.contains(key);

        result_map.insert(wrap_key(key), schema);
      } else if source_type == "zen/map" {
        if value.get("validation-type").is_some()
          && value.get("validation-type").unwrap().as_str().unwrap() == "open"
        {
          result_map.insert(
            wrap_key(key),
            ElementSchema {
              extends: Some(value_confirms),
              is_array: false,
              is_reference: false,
              require: required.contains(key),
              description: get_description!(value),
              sub_type: None,
              plain_type: None,
              values: None,
            },
          );
        } else if value.get("keys").is_some() {
          let sub_type = match read_map(
            box_instance,
            cache,
            resource_name,
            value.get("keys").unwrap(),
            value.get("require"),
            log_handler,
          )
          .await
          {
            Ok(it) => it,
            Err(e) => return Err(e),
          };

          result_map.insert(
            wrap_key(key),
            ElementSchema {
              extends: Some(value_confirms),
              is_array: false,
              is_reference: false,
              require: false,
              description: get_description!(value),
              sub_type: Some(sub_type),
              plain_type: None,
              values: None,
            },
          );
        } else {
          let mut sub = HashMap::new();

          sub.insert(
            "__".to_string(),
            ElementSchema {
              extends: None,
              is_array: false,
              is_reference: false,
              require: false,
              description: get_description!(value),
              sub_type: None,
              plain_type: None,
              values: None,
            },
          );
          result_map.insert(
            wrap_key(key),
            ElementSchema {
              extends: Some(value_confirms),
              is_array: false,
              is_reference: false,
              require: false,
              description: get_description!(value),
              sub_type: Some(sub),
              plain_type: None,
              values: None,
            },
          );
        }
      } else if source_type == "zen/string" || source_type == "zen/keyword" {
        let (plain_type, values) = match value.get("enum") {
          Some(it) => {
            let sub_target: Vec<_> = it
              .as_array()
              .unwrap()
              .iter()
              .map(|item| item.get("value").unwrap().as_str().unwrap().to_string())
              .collect();
            if sub_target.is_empty() {
              (Some("string".to_string()), None)
            } else {
              (None, Some(sub_target))
            }
          },
          None => (Some("string".to_string()), None),
        };
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type,
            extends: None,
            is_array: false,
            is_reference: false,
            values,
          },
        );
      } else if source_type == "zen/number" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("number".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/datetime" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("dateTime".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/boolean" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("boolean".to_string()),
            extends: None,
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/integer" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("integer".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/date" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("date".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/any" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("any".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/symbol" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("string".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/set" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description!(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("string".to_string()),
            extends: Some(value_confirms),
            is_array: true,
            is_reference: false,
            values: None,
          },
        );
      } else {
        log_handler(format!(
          "Unknown type in '{}'. Key: '{}'. {:#?}",
          resource_name, key, value
        ));
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            extends: None,
            is_array: false,
            is_reference: false,
            require: required.contains(key),
            description: get_description!(value),
            sub_type: None,
            plain_type: None,
            values: None,
          },
        );
      }
    } else {
      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description!(value),
          sub_type: None,
          plain_type: None,
          values: None,
        },
      );
    }
  }

  Ok(result_map)
}

async fn read_keys(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  definition: &HashMap<String, Value>,
  log_handler: &(impl Fn(String) + Sync),
) -> Result<HashMap<String, ElementSchema>, String> {
  let type_map = match definition.get("keys") {
    Some(keys) => {
      match read_map(
        box_instance,
        cache,
        resource_name,
        keys,
        definition.get("require").to_owned(),
        log_handler,
      )
      .await
      {
        Ok(it) => it,
        Err(e) => return Err(e),
      }
    },
    None => {
      let mut res: HashMap<String, ElementSchema> = HashMap::new();

      res.insert(
        "__".to_string(),
        ElementSchema {
          description: get_description!(definition),
          require: false,
          sub_type: None,
          plain_type: None,
          extends: None,
          is_array: false,
          is_reference: false,
          values: None,
        },
      );
      res
    },
  };
  Ok(type_map)
}

async fn read_rpc(
  box_instance: &BoxClient,
  cache: &mut Cache,
  symbol_name: &String,
  resource_name: &str,
  definition: &HashMap<String, Value>,
  log_handler: &(impl Fn(String) + Sync),
) -> Result<ElementWrapper, String> {
  let target_name = definition
    .get("zen/name")
    .unwrap()
    .as_str()
    .unwrap()
    .to_string()
    .split('/')
    .map(|item| match item.contains('.') {
      true => item
        .split('.')
        .map(|item| capitalize(item.split('-').map(capitalize).join("").as_str()))
        .join(""),
      false => capitalize(item.split('-').map(capitalize).join("").as_str()),
    })
    .join("");

  let rpc_name = format!("RPC{}", target_name);

  if definition.get("params").is_some() {
    let value = definition.get("params").unwrap();
    if value.get("validation-type").is_some()
      && value.get("validation-type").unwrap().as_str().unwrap() == "open"
    {
      let mut sub = HashMap::new();

      sub.insert(
        "__".to_string(),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: false,
          description: get_description!(value),
          sub_type: None,
          plain_type: None,
          values: None,
        },
      );

      Ok(ElementWrapper {
        name: rpc_name,
        element: Element {
          is_rpc: true,
          rpc_method: Some(symbol_name.to_owned()),
          description: None,
          profile: false,
          extends: None,
          plain: None,
          schema: Some(sub),
          values: None,
        },
      })
    } else if value.get("keys").is_some() {
      let sub_type = match read_map(
        box_instance,
        cache,
        resource_name,
        value.get("keys").unwrap(),
        value.get("require"),
        log_handler,
      )
      .await
      {
        Ok(it) => it,
        Err(e) => return Err(e),
      };

      Ok(ElementWrapper {
        name: rpc_name,
        element: Element {
          is_rpc: true,
          rpc_method: Some(symbol_name.to_owned()),
          description: None,
          profile: false,
          extends: None,
          plain: None,
          schema: match sub_type.is_empty() {
            true => None,
            false => Some(sub_type),
          },
          values: None,
        },
      })
    } else {
      let mut sub = HashMap::new();

      sub.insert(
        "__".to_string(),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: false,
          description: get_description!(value),
          sub_type: None,
          plain_type: None,
          values: None,
        },
      );
      Ok(ElementWrapper {
        name: rpc_name,
        element: Element {
          is_rpc: true,
          rpc_method: Some(symbol_name.to_owned()),
          description: None,
          profile: false,
          extends: None,
          plain: None,
          schema: Some(sub),
          values: None,
        },
      })
    }
  } else {
    Ok(ElementWrapper {
      name: rpc_name,
      element: Element {
        is_rpc: true,
        rpc_method: Some(symbol_name.to_owned()),
        description: None,
        profile: false,
        extends: None,
        plain: None,
        schema: None,
        values: None,
      },
    })
  }
}

pub async fn symbol_read(
  box_instance: &BoxClient,
  cache: &mut Cache,
  symbol: &String,
  include_profile: Option<String>,
  exclude: ExcludeConfig,
  log_handler: &(impl Fn(String) + Sync),
) -> Result<Option<ElementWrapper>, String> {
  let definition = match get_symbol(box_instance, cache, symbol).await {
    Ok(def) => def,
    Err(e) => return Err(e),
  };

  if definition.get("zen/tags").is_some() {
    let tags: Vec<_> = definition["zen/tags"]
      .as_array()
      .unwrap()
      .iter()
      .filter_map(Value::as_str)
      .collect();

    let excluded_tags = vec![
      "zen.fhir/search".to_string(),
      "zen/tag".to_string(),
      "aidbox.rest/param-engine".to_string(),
      "aidbox.rest/search-by-engine".to_string(),
      "aidbox.rest/op-engine".to_string(),
      "aidbox.rest/middleware-engine".to_string(),
      "aidbox.rest.acl/filter-table-insert-engine".to_string(),
      "aidbox.rest.acl/coerce-method".to_string(),
      "aidbox.rest.acl/sql-template".to_string(),
      "aidbox.rest/op".to_string(),
      "aidbox.rest.acl/filter".to_string(),
      "aidbox.rest/api".to_string(),
      "aidbox.rest.acl/request-param".to_string(),
      "aidbox.rest/middleware".to_string(),
      "aidbox.auth/grant-lookup".to_string(),
      "aidbox/system".to_string(),
      "aidbox/service".to_string(),
    ];

    let user_excluded_tags = match exclude.tags {
      Some(t) => t,
      None => vec![],
    };

    if tags.contains(&"zen.fhir/profile-schema") {
      if include_profile.is_some() {}
      match include_profile.clone() {
        Some(profile) => {
          match symbol
            .as_str()
            .starts_with(format!("{}.", profile).as_str())
            || symbol.as_str().starts_with("hl7-fhir-r4-core.")
          {
            false => return Ok(None),
            true => {},
          }
        },
        None => match symbol.as_str().starts_with("hl7-fhir-r4-core.") {
          false => return Ok(None),
          true => {},
        },
      };
    }

    if include_profile.is_some() {
      let profile = include_profile.unwrap();
      if tags.contains(&"zen.fhir/profile-schema") || tags.contains(&"zen.fhir/structure-schema") {
        match symbol
          .as_str()
          .starts_with(format!("{}.", profile).as_str())
          || symbol.as_str().starts_with("hl7-fhir-r4-core.")
        {
          false => {
            return Ok(None);
          },
          true => {},
        }
      }
    }

    if tags.iter().any(|item| {
      excluded_tags.contains(&item.to_string()) || user_excluded_tags.contains(&item.to_string())
    }) {
      return Ok(None);
    }

    let resource_name = get_name(&definition);

    if resource_name == "Reference" {
      return Ok(None);
    }

    let confirms = match init_confirms(box_instance, cache, &resource_name, &definition).await {
      Ok(def) => def,
      Err(e) => {
        log_handler(format!("[ReadSymbol:initConfirms] {}", e));
        return Err(e.to_string());
      },
    };

    return if tags.contains(&"zenbox/rpc") {
      return if let Ok(rpc) = read_rpc(
        box_instance,
        cache,
        symbol,
        &resource_name,
        &definition,
        log_handler,
      )
      .await
      {
        Ok(Some(rpc))
      } else {
        Ok(None)
      };
    } else if tags.contains(&"zenbox/persistent") {
      if is_persistent_any(&definition) {
        let mut sub_type = HashMap::new();

        sub_type.insert(
          "__".to_string(),
          ElementSchema {
            require: false,
            extends: None,
            plain_type: None,
            sub_type: None,
            description: None,
            is_array: false,
            is_reference: false,
            values: None,
          },
        );

        Ok(Some(ElementWrapper {
          name: resource_name.clone(),
          element: Element {
            is_rpc: false,
            rpc_method: None,
            description: get_description!(&definition),
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            schema: Some(sub_type),
            plain: None,
            values: None,
          },
        }))
      } else {
        Ok(Some(ElementWrapper {
          name: resource_name.clone(),
          element: Element {
            is_rpc: false,
            rpc_method: None,
            description: get_description!(&definition),
            profile: false,
            extends: Some(vec![format!("Resource<'{}'>", resource_name)]),
            schema: Some(
              read_keys(
                box_instance,
                cache,
                &resource_name,
                &definition,
                log_handler,
              )
              .await
              .expect(""),
            ),
            plain: None,
            values: None,
          },
        }))
      }
    } else if tags.contains(&"zen.fhir/structure-schema") {
      if is_type_and_not_map(&definition) {
        let primitive_type = convert_primitive(definition["type"].as_str().unwrap());

        if cache.primitives.get(&resource_name).is_none() {
          cache.primitives.insert(
            resource_name.clone(),
            serde_json::to_value(&primitive_type).unwrap(),
          );
        }
        Ok(Some(ElementWrapper {
          name: resource_name.clone(),
          element: Element {
            is_rpc: false,
            rpc_method: None,
            description: get_description!(&definition),
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            schema: None,
            plain: Some(primitive_type),
            values: None,
          },
        }))
      } else if definition.get("type").is_none() {
        let values = match definition.get("zen.fhir/value-set") {
          Some(it) => match get_value_set(
            box_instance,
            cache,
            it.get("symbol").unwrap().as_str().unwrap(),
          )
          .await
          {
            Ok(def) => Some(def),
            Err(e) => return Err(e.to_string()),
          },
          None => None,
        };

        if !definition["zen/name"]
          .as_str()
          .unwrap()
          .split('.')
          .collect::<Vec<&str>>()
          .get(1)
          .unwrap()
          .contains('-')
        {
          if confirms.join(", ") != resource_name {
            Ok(Some(ElementWrapper {
              name: resource_name.clone(),
              element: Element {
                is_rpc: false,
                rpc_method: None,
                description: get_description!(&definition),
                profile: false,
                extends: normalize_confirms(&confirms, &resource_name),
                schema: None,
                plain: None,
                values,
              },
            }))
          } else {
            let new_name = zen_path_to_name(&definition["zen/name"]);

            Ok(Some(ElementWrapper {
              name: new_name.clone(),
              element: Element {
                is_rpc: false,
                rpc_method: None,
                description: get_description!(&definition),
                profile: false,
                extends: normalize_confirms(&confirms, &new_name),
                schema: None,
                plain: None,
                values,
              },
            }))
          }
        } else {
          Ok(None)
        }
      } else {
        let mut keys = match read_keys(
          box_instance,
          cache,
          &resource_name,
          &definition,
          log_handler,
        )
        .await
        {
          Ok(def) => def,
          Err(e) => return Err(e),
        };

        if resource_name == "Resource" {
          keys.insert(
            "resourceType".to_string(),
            ElementSchema {
              description: None,
              require: true,
              sub_type: None,
              plain_type: Some("T".to_string()),
              extends: None,
              is_array: false,
              is_reference: false,
              values: None,
            },
          );

          Ok(Some(ElementWrapper {
            name: String::from("Resource<T = string>"),
            element: Element {
              is_rpc: false,
              rpc_method: None,
              description: get_description!(&definition),
              profile: tags.contains(&"zen.fhir/profile-schema"),
              extends: None,
              schema: Some(keys),
              plain: None,
              values: None,
            },
          }))
        } else if resource_name == "DomainResource" {
          Ok(Some(ElementWrapper {
            name: String::from("DomainResource"),
            element: Element {
              is_rpc: false,
              rpc_method: None,
              description: get_description!(&definition),
              profile: tags.contains(&"zen.fhir/profile-schema"),
              extends: None,
              schema: Some(keys),
              plain: None,
              values: None,
            },
          }))
        } else {
          Ok(Some(ElementWrapper {
            name: resource_name.clone(),
            element: Element {
              is_rpc: false,
              rpc_method: None,
              description: get_description!(&definition),
              profile: tags.contains(&"zen.fhir/profile-schema"),
              extends: normalize_confirms(&confirms, &resource_name),
              schema: Some(keys),
              plain: None,
              values: None,
            },
          }))
        }
      }
    } else {
      let keys = match read_keys(
        box_instance,
        cache,
        &resource_name,
        &definition,
        log_handler,
      )
      .await
      {
        Ok(def) => def,
        Err(e) => {
          log_handler(e.clone());
          return Err(e);
        },
      };
      Ok(Some(ElementWrapper::new(
        resource_name.clone(),
        Element {
          is_rpc: false,
          rpc_method: None,
          description: get_description!(&definition),
          profile: tags.contains(&"zen.fhir/profile-schema"),
          extends: normalize_confirms(&confirms, &resource_name),
          schema: Some(keys),
          plain: None,
          values: None,
        },
      )))
    };
  }

  Ok(None)
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct ReadSchemaResponse {
  pub symbol: String,
  pub name: String,
  pub element: Element,
}

pub async fn read_schema<'a>(
  symbols: Vec<String>,
  box_instance: BoxClient,
  cache: &'a mut Cache,
  include_profile: Option<String>,
  exclude: ExcludeConfig,
  log_handler: &'a (impl Fn(String) + Sync),
) -> impl futures_core::Stream<Item = ReadSchemaResponse> + Send + 'a {
  stream! {
    for symbol in symbols.iter(){
      if let Ok(it) = symbol_read(
      &box_instance,
      cache,
      symbol,
      include_profile.clone(),
      exclude.clone(),
        log_handler,
    )
    .await
    {
      if it.is_some() {
        let new_element = it.unwrap();
        yield (ReadSchemaResponse{
        symbol: symbol.to_owned(),
        name: new_element.name.to_string(),
        element:  new_element.element.clone(),
        })
      }
    }
    }
  }
}
