use crate::generator::cache::Cache;
use crate::generator::common::deep_merge_element_schema;
use crate::generator::helpers::{
  convert_primitive, get_confirms, get_description, get_description_value, get_name, get_symbol,
  get_value_set, init_confirms, init_confirms_value, init_reference_confirms_value,
  is_persistent_any, is_type_and_not_map, normalize_confirms, wrap_key, zen_path_to_name,
};
use crate::r#box::requests::BoxClient;
use indicatif::{ProgressBar, ProgressStyle};
use log::{info, warn};
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;

use super::common::{Element, ElementSchema, ElementWrapper};

async fn read_vector(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  every: &Value,
) -> Result<
  (
    bool,
    Option<String>,
    Option<HashMap<String, ElementSchema>>,
    bool,
    Option<Vec<String>>,
  ),
  Box<dyn Error>,
> {
  if every.get("zen.fhir/value-set").is_some() {
    let values = get_value_set(
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
    .await?;

    if every.get("confirms").is_some() {
      let confirm = init_confirms_value(box_instance, cache, resource_name, every).await?;

      let single_confirm = confirm.get(0);
      if single_confirm.is_some() {
        if single_confirm.unwrap() == "code" {
          if values.is_empty() {
            Ok((true, Some("code".to_string()), None, false, None))
          } else {
            Ok((
              true,
              None,
              None,
              false,
              Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            ))
          }
        } else if single_confirm.unwrap() == "CodeableConcept" {
          if values.is_empty() {
            Ok((true, Some("CodeableConcept".to_string()), None, false, None))
          } else {
            Ok((
              true,
              Some("CodeableConcept".to_string()),
              None,
              false,
              Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            ))
          }
        } else if single_confirm.unwrap() == "Coding" {
          if values.is_empty() {
            Ok((true, Some("Coding".to_string()), None, false, None))
          } else {
            Ok((
              true,
              Some("Coding".to_string()),
              None,
              false,
              Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            ))
          }
        } else {
          println!("Vector value single confirm hz - {}", every);
          std::process::exit(0);
          return Ok((false, Some("Array<any>".to_string()), None, false, None));
        }
      } else {
        println!(
          "Vector value set no sinble confirm - {} - {:#?}",
          every, confirm
        );
        std::process::exit(0);
        return Ok((false, Some("Array<any>".to_string()), None, false, None));
      }
    } else {
      println!("Vector value set else - {}", every);
      std::process::exit(0);
      Ok((true, None, None, false, None))
    }
  } else if every.get("type").is_some() {
    let nested_type = every.get("type").unwrap();
    if nested_type == "zen/string" {
      let (plain_type, values) = match every.get("enum") {
        Some(it) => {
          let sub_target: Vec<_> = it
            .as_array()
            .unwrap()
            .iter()
            .map(|item| format!("\"{}\"", item.get("value").unwrap().as_str().unwrap()))
            .collect();

          if sub_target.is_empty() {
            (Some("string".to_string()), None)
          } else {
            (None, Some(sub_target))
          }
        },
        None => (Some("string".to_string()), None),
      };

      Ok((true, plain_type, None, false, values))
    } else if nested_type == "zen/map" {
      if every.get("validation-type").is_some()
        && every.get("validation-type").unwrap().as_str().unwrap() == "open"
      {
        Ok((true, None, None, false, None))
      } else if every.get("keys").is_some() {
        let sub_type = read_map(
          box_instance,
          cache,
          resource_name,
          every.get("keys").unwrap(),
          every.get("require"),
        )
        .await?;
        Ok((true, None, Some(sub_type), false, None))
      } else {
        Ok((true, None, None, false, None))
      }
    } else {
      println!("Vector nested unparsed type {}", every);
      std::process::exit(0);
      Ok((true, None, None, false, None))
    }
  } else if every
    .get("zen.fhir/reference")
    .map(|it| it.as_object())
    .map(|it| it.unwrap())
    .map(|it| it.get("refers"))
    .is_some()
  {
    let refers = init_reference_confirms_value(box_instance, cache, resource_name, every).await?;
    let (plain_type, values) = match refers.is_empty() {
      false => (None, Some(refers)),
      true => (Some("Reference".to_string()), None),
    };
    Ok((true, plain_type, None, true, values))
  } else if every.get("confirms").is_some() {
    let confirms = match every.get("confirms") {
      Some(it) => it
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|item| item.as_str())
        .collect(),
      _ => vec![],
    };
    let (values, plain_type) =
      match get_confirms(box_instance, cache, confirms, resource_name).await {
        Ok(mut it) => match it.len() {
          1 => (None, Some(it.remove(0))),
          _ => (None, None),
        },
        Err(..) => (None, None),
      };
    Ok((true, plain_type, None, false, values))
  } else {
    warn!("Empty vector def {} for resource {}", every, resource_name);
    Ok((false, None, None, false, None))
  }
}

#[async_recursion::async_recursion]
async fn read_map(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  keys: &Value,
  require_keys: Option<&'async_recursion Value>,
) -> Result<HashMap<String, ElementSchema>, Box<dyn Error>> {
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
      let values = get_value_set(
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
      .await?;

      let (plain_type, values) = match values.is_empty() {
        true => {
          let confirms = init_confirms_value(box_instance, cache, resource_name, value).await?;
          match confirms.is_empty() {
            false => (None, Some(confirms)),
            true => (Some("any".to_string()), None),
          }
        },
        false => (
          None,
          Some(
            values
              .iter()
              .map(|it| format!("\"{}\"", it))
              .collect::<Vec<_>>(),
          ),
        ),
      };

      result_map.insert(
        wrap_key(key),
        ElementSchema::new(
          false,
          false,
          required.contains(key),
          get_description_value(value),
          None,
          plain_type,
          values,
          None,
        ),
      );
    } else if value.get("type").is_none() && value.get("confirms").is_some() {
      if value
        .get("zen.fhir/reference")
        .map(|it| it.as_object())
        .map(|it| it.unwrap())
        .map(|it| it.get("refers"))
        .is_some()
      {
        let mut refers =
          init_reference_confirms_value(box_instance, cache, resource_name, value).await?;
        let (plain_type, values): (Option<String>, Option<Vec<String>>) = match refers.is_empty() {
          true => (Some("any".to_string()), None),
          false => match refers.len() {
            1 => (Some(refers.remove(0)), None),
            _ => (None, Some(refers)),
          },
        };

        result_map.insert(
          wrap_key(key),
          ElementSchema::new(
            false,
            true,
            required.contains(key),
            get_description_value(value),
            None,
            plain_type,
            values,
            None,
          ),
        );
      } else {
        let mut sub_confirms =
          init_confirms_value(box_instance, cache, resource_name, value).await?;

        let (plain_type, values): (Option<String>, Option<Vec<String>>) =
          match sub_confirms.is_empty() {
            true => (Some("any".to_string()), None),
            false => match sub_confirms.len() {
              1 => (Some(sub_confirms.remove(0)), None),
              _ => (None, Some(sub_confirms)),
            },
          };

        result_map.insert(
          wrap_key(key),
          ElementSchema::new(
            false,
            false,
            required.contains(key),
            get_description_value(value),
            None,
            plain_type,
            values,
            None,
          ),
        );
      }
    } else if value.get("type").is_none() {
      result_map.insert(
        wrap_key(key),
        ElementSchema::new(
          false,
          false,
          required.contains(key),
          get_description_value(value),
          None,
          Some("any".to_string()),
          None,
          None,
        ),
      );
    } else if value.get("type").is_some() {
      let source_type = value.get("type").unwrap().as_str().unwrap();
      if source_type == "zen/vector" {
        let (is_array, plain_type, sub_type, is_reference, values) = read_vector(
          box_instance,
          cache,
          resource_name,
          value.get("every").unwrap(),
        )
        .await?;

        result_map.insert(
          wrap_key(key),
          ElementSchema::new(
            is_array,
            is_reference,
            required.contains(key),
            get_description_value(value.get("every").unwrap()),
            sub_type,
            plain_type,
            values,
            None,
          ),
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/map" {
        if value.get("validation-type").is_some() {
          if value.get("validation-type").unwrap().as_str().unwrap() == "open" {
            result_map.insert(
              wrap_key(key),
              ElementSchema::new(
                false,
                false,
                required.contains(key),
                get_description_value(value),
                None,
                None,
                None,
                None,
              ),
            );
          }
        } else if value.get("confirms").is_some() {
          let sub_confirms_vec: Vec<_> = value
            .get("confirms")
            .unwrap()
            .as_array()
            .unwrap()
            .iter()
            .map(|it| it.as_str().unwrap())
            .collect();

          let sub_confirms =
            get_confirms(box_instance, cache, sub_confirms_vec, resource_name).await?;

          if value.get("keys").is_some() {
            let sub_type = read_map(
              box_instance,
              cache,
              resource_name,
              value.get("keys").unwrap(),
              value.get("require"),
            )
            .await?;

            result_map.insert(
              wrap_key(key),
              ElementSchema::new(
                false,
                false,
                required.contains(key),
                get_description_value(value),
                Some(sub_type),
                None,
                None,
                Some(sub_confirms),
              ),
            );
          } else {
            println!("Map confirms else {}", value);
            std::process::exit(0);
            // result_map.insert(
            //   wrap_key(key),
            //   TypeElementSubType {
            //     description: get_description_value(value),
            //     require: required.contains(key),
            //     sub_type: None,
            //     plain_type: Some("any".to_string()),
            //     extends: None,
            //     array: false,
            //   },
            // );
          }
        } else if value.get("keys").is_some() {
          let sub_type = read_map(
            box_instance,
            cache,
            resource_name,
            value.get("keys").unwrap(),
            value.get("require"),
          )
          .await?;

          result_map.insert(
            wrap_key(key),
            ElementSchema::new(
              false,
              false,
              required.contains(key),
              get_description_value(value),
              Some(sub_type),
              None,
              None,
              None,
            ),
          );
        } else if value.get("values").is_some() {
          println!("Map values {}", value);
          std::process::exit(0);
          if value.get("values").unwrap().get("type").is_some()
            && value
              .get("values")
              .unwrap()
              .get("type")
              .unwrap()
              .as_str()
              .unwrap()
              == "zen/any"
          {
            // result_map.insert(
            //   wrap_key(key),
            //   TypeElementSubType {
            //     description: get_description_value(value),
            //     require: required.contains(key),
            //     sub_type: None,
            //     plain_type: Some("Record<string,any>".to_string()),
            //     extends: None,
            //     array: false,
            //   },
            // );
          }
        } else if value.get("values").is_some() {
          println!("Map va;ues keys {}", value);
          std::process::exit(0);
          if value.get("values").unwrap().get("keys").is_some() {
            let sub_type = read_map(
              box_instance,
              cache,
              resource_name,
              value.get("keys").unwrap(),
              value.get("require"),
            )
            .await?;
            // result_map.insert(
            //   wrap_key(key),
            //   TypeElementSubType {
            //     description: get_description_value(value),
            //     require: required.contains(key),
            //     sub_type: Some(sub_type),
            //     plain_type: None,
            //     extends: None,
            //     array: false,
            //   },
            // );
          }
        } else {
          // result_map.insert(
          //   wrap_key(key),
          //   TypeElementSubType {
          //     description: get_description_value(value),
          //     require: required.contains(key),
          //     sub_type: None,
          //     plain_type: Some("any".to_string()),
          //     extends: None,
          //     array: false,
          //   },
          // );
        }
      } else if source_type == "zen/boolean" {
        result_map.insert(
          wrap_key(key),
          ElementSchema::new(
            false,
            false,
            required.contains(key),
            get_description_value(value),
            None,
            Some("boolean".to_string()),
            None,
            None,
          ),
        );
      } else if source_type == "zen/string" {
        let (plain_type, values) = match value.get("enum") {
          Some(it) => {
            let sub_target: Vec<_> = it
              .as_array()
              .unwrap()
              .iter()
              .map(|item| format!("\"{}\"", item.get("value").unwrap().as_str().unwrap()))
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
            description: get_description_value(value),
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
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("number".to_string()),
            extends: None,
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else if source_type == "zen/datetime" {
        result_map.insert(
          wrap_key(key),
          ElementSchema {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("dateTime".to_string()),
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
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("integer".to_string()),
            extends: None,
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else {
        println!("Type {} -  {} - {}", source_type, key, value);

        std::process::exit(0);
      }
    } else {
      println!("{} - {}", key, value);

      println!("{:#?}", result_map);
      info!("Parse map: unknown case {:#?} {:#?}", key, value);

      std::process::exit(0);
    }
  }

  Ok(result_map)
}

async fn read_keys(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  definition: &HashMap<String, Value>,
) -> Result<HashMap<String, ElementSchema>, Box<dyn Error>> {
  let type_map = match definition.get("keys") {
    Some(keys) => {
      read_map(
        box_instance,
        cache,
        resource_name,
        keys,
        definition.get("require").to_owned(),
      )
      .await?
    },
    None => {
      let mut res: HashMap<String, ElementSchema> = HashMap::new();

      res.insert(
        "[key: string]".to_string(),
        ElementSchema {
          description: get_description(&definition),
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

async fn read_symbol(
  box_instance: &BoxClient,
  cache: &mut Cache,
  symbol: &String,
  include_profiles: bool,
) -> Result<Option<ElementWrapper>, Box<dyn Error>> {
  let definition = get_symbol(box_instance, cache, symbol).await?;

  if definition.get("zen/tags").is_some() {
    let tags: Vec<_> = definition["zen/tags"]
      .as_array()
      .unwrap()
      .iter()
      .filter_map(|item| item.as_str())
      .collect();

    if tags.contains(&"zen.fhir/profile-schema") && !include_profiles {
      return Ok(None);
    }
    if tags.contains(&"zen.fhir/search") || tags.contains(&"zenbox/rpc") {
      return Ok(None);
    }

    let resource_name = get_name(&definition);

    if resource_name == "Reference" {
      return Ok(None);
    }

    if resource_name != "Patient" {
      return Ok(None);
    }

    let confirms = init_confirms(box_instance, cache, &resource_name, &definition).await?;

    if tags.contains(&"zenbox/persistent") {
      return if is_persistent_any(&definition) {
        let mut sub_type = HashMap::new();

        sub_type.insert(
          "[key: string]".to_string(),
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
            description: get_description(&definition),
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            schema: Some(sub_type),
            plain: None,
          },
        }))
      } else {
        Ok(Some(ElementWrapper {
          name: resource_name.clone(),
          element: Element {
            description: get_description(&definition),
            profile: false,
            extends: Some(vec![format!("Resource<'{}'>", resource_name)]),
            schema: Some(read_keys(box_instance, cache, &resource_name, &definition).await?),
            plain: None,
          },
        }))
      };
    } else if tags.contains(&"zen.fhir/structure-schema") {
      if is_type_and_not_map(&definition) {
        let primitive_type = convert_primitive(definition["type"].as_str().unwrap());

        if cache.primitives.get(&resource_name).is_none() {
          cache.primitives.insert(
            resource_name.clone(),
            serde_json::to_value(&primitive_type).unwrap(),
          );
        }
        return Ok(Some(ElementWrapper {
          name: resource_name.clone(),
          element: Element {
            description: get_description(&definition),
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            schema: None,
            plain: Some(primitive_type),
          },
        }));
      } else if definition.get("type").is_none() {
        if !definition["zen/name"]
          .as_str()
          .unwrap()
          .split('.')
          .collect::<Vec<&str>>()
          .get(1)
          .unwrap()
          .contains('-')
        {
          return if confirms.join(", ") != resource_name {
            Ok(Some(ElementWrapper {
              name: resource_name.clone(),
              element: Element {
                description: get_description(&definition),
                profile: false,
                extends: normalize_confirms(&confirms, &resource_name),
                schema: None,
                plain: None,
              },
            }))
          } else {
            Ok(Some(ElementWrapper {
              name: zen_path_to_name(&definition["zen/name"]),
              element: Element {
                description: get_description(&definition),
                profile: false,
                extends: normalize_confirms(&confirms, &resource_name),
                schema: None,
                plain: None,
              },
            }))
          };
        } else {
          warn!(
            "Should be process later {}",
            definition.get("zen/file").unwrap()
          );
          return Ok(None);
        }
      } else {
        let mut keys = read_keys(box_instance, cache, &resource_name, &definition).await?;

        return if resource_name == "Resource" {
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
            name: String::from("Resource<T>"),
            element: Element {
              description: get_description(&definition),
              profile: tags.contains(&"zen.fhir/profile-schema"),
              extends: normalize_confirms(&confirms, &resource_name),
              schema: Some(keys),
              plain: None,
            },
          }))
        } else {
          Ok(Some(ElementWrapper {
            name: resource_name.clone(),
            element: Element {
              description: get_description(&definition),
              profile: tags.contains(&"zen.fhir/profile-schema"),
              extends: normalize_confirms(&confirms, &resource_name),
              schema: Some(keys),
              plain: None,
            },
          }))
        };
      }
    } else {
      return Ok(Some(ElementWrapper::new(
        resource_name.clone(),
        Element {
          description: get_description(&definition),
          profile: tags.contains(&"zen.fhir/profile-schema"),
          extends: normalize_confirms(&confirms, &resource_name),
          schema: Some(read_keys(box_instance, cache, &resource_name, &definition).await?),
          plain: None,
        },
      )));
    }
  }
  Ok(None)
}

pub async fn read_schema(
  box_instance: BoxClient,
  cache: &mut Cache,
  include_profiles: bool,
) -> Result<HashMap<String, Element>, Box<dyn Error>> {
  let symbols = box_instance
    .load_all_symbols(cache.cache_path.clone())
    .await?;

  let pb = ProgressBar::new(symbols.len() as u64);
  pb.set_style(
    ProgressStyle::with_template("{spinner:.green} [{elapsed}] [{bar:40.cyan/red}] ({pos}/{len})")
      .unwrap()
      .progress_chars("#>-"),
  );

  let mut result: Vec<ElementWrapper> = Vec::new();

  for symbol in symbols.iter() {
    if let Ok(it) = read_symbol(&box_instance, cache, symbol, include_profiles).await {
      if it.is_some() {
        result.push(it.unwrap())
      }
    };
    pb.inc(1);
  }

  pb.finish();

  info!(
    "Symbols {:#?} of {:#?} processed in {:?}",
    result.len(),
    symbols.len(),
    (pb.elapsed().as_secs_f64() * 100f64).floor() / 100f64
  );

  let mut result_types: HashMap<String, Element> = HashMap::new();

  result.iter().for_each(
    |new_element| match result_types.get(new_element.name.as_str()) {
      Some(old_element) => {
        if new_element.element.profile {
          let merged_types = match old_element.schema.is_some() {
            true => match new_element.element.schema.is_some() {
              true => Some(deep_merge_element_schema(
                old_element.schema.clone().unwrap(),
                new_element.element.schema.clone().unwrap(),
              )),
              false => old_element.schema.clone(),
            },
            false => new_element.element.schema.clone(),
          };

          result_types.insert(
            new_element.name.to_string(),
            Element {
              description: new_element.element.description.clone(),
              profile: new_element.element.profile,
              extends: new_element.element.extends.clone(),
              plain: new_element.element.plain.clone(),
              schema: merged_types,
            },
          );
        } else {
          let merged_types = match new_element.element.schema.is_some() {
            true => match new_element.element.schema.is_some() {
              true => match old_element.schema.is_some() {
                true => Some(deep_merge_element_schema(
                  new_element.element.schema.clone().unwrap(),
                  old_element.schema.clone().unwrap(),
                )),
                false => Some(new_element.element.schema.clone().unwrap()),
              },
              false => new_element.element.schema.clone(),
            },
            false => old_element.schema.clone(),
          };
          result_types.insert(
            new_element.name.to_string(),
            Element {
              description: old_element.description.clone(),
              profile: old_element.profile,
              extends: old_element.extends.clone(),
              plain: old_element.plain.clone(),
              schema: merged_types,
            },
          );
        };
      },
      None => {
        result_types.insert(new_element.name.to_string(), new_element.element.clone());
      },
    },
  );

  println!("{:#?}", result_types);

  Ok(result_types)
}
