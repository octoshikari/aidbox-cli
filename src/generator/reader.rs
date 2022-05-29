use crate::generator::cache::Cache;
use crate::generator::common::deep_merge_element_schema;
use crate::generator::helpers::{
  convert_primitive, get_description, get_description_value, get_name, get_symbol, get_value_set,
  init_confirms, init_confirms_value, init_reference_confirms_value, is_persistent_any,
  is_type_and_not_map, normalize_confirms, wrap_key, zen_path_to_name,
};
use crate::r#box::requests::BoxClient;
use indicatif::{ProgressBar, ProgressStyle};
use itertools::Itertools;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;

use super::common::{Element, ElementSchema, ElementWrapper};

async fn read_vector(
  box_instance: &BoxClient,
  cache: &mut Cache,
  resource_name: &str,
  value: &Value,
) -> Result<ElementSchema, Box<dyn Error>> {
  let description = get_description_value(value);
  let every = value.get("every").unwrap();

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
      let confirm = init_confirms_value(box_instance, cache, every).await?;

      let single_confirm = confirm.get(0);
      if single_confirm.is_some() {
        if single_confirm.unwrap() == "code" {
          return if values.is_empty() {
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
              values: Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            })
          };
        } else if single_confirm.unwrap() == "CodeableConcept" {
          return if values.is_empty() {
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
              values: Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            })
          };
        } else if single_confirm.unwrap() == "Coding" {
          return if values.is_empty() {
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
              values: Some(values.iter().map(|it| format!("\"{}\"", it)).collect()),
            })
          };
        } else {
          println!("wtf {:#?} - {:#?}", every, confirm);
          std::process::exit(0);
        }
      } else {
        println!("wtf2 {:#?} - {:#?}", every, confirm);
        std::process::exit(0);
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
    let refers = init_reference_confirms_value(box_instance, cache, resource_name, every).await?;
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
    let confirms = init_confirms_value(box_instance, cache, every).await?;

    if vector_type == "zen/map" {
      return if every.get("validation-type").is_some()
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
            description: get_description_value(value),
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
        let sub_type = read_map(
          box_instance,
          cache,
          resource_name,
          every.get("keys").unwrap(),
          every.get("require"),
        )
        .await?;

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
            description: get_description_value(value),
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
      };
    } else if vector_type == "zen/string" {
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
    } else {
      println!("Vector nested unparsed type {}", every);
      std::process::exit(0);
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
          let confirms = init_confirms_value(box_instance, cache, value).await?;
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
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description_value(value),
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
      let refers = init_reference_confirms_value(box_instance, cache, resource_name, value).await?;
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
          description: get_description_value(value),
          sub_type: None,
          plain_type,
          values,
        },
      );
    } else if value.get("type").is_none() && value.get("confirms").is_some() {
      let confirms = init_confirms_value(box_instance, cache, value).await?;
      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: Some(confirms),
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description_value(value),
          sub_type: None,
          plain_type: None,
          values: None,
        },
      );
    } else if value.get("type").is_some() {
      let source_type = value.get("type").unwrap().as_str().unwrap();
      let value_confirms = init_confirms_value(box_instance, cache, value).await?;

      if source_type == "zen/vector" {
        let mut schema = read_vector(box_instance, cache, resource_name, value).await?;

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
              description: get_description_value(value),
              sub_type: None,
              plain_type: None,
              values: None,
            },
          );
        }
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
            extends: Some(value_confirms),
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
            description: get_description_value(value),
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
            description: get_description_value(value),
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
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("integer".to_string()),
            extends: Some(value_confirms),
            is_array: false,
            is_reference: false,
            values: None,
          },
        );
      } else {
        println!("Unknown type {:#?} {:?}, {:#?}", resource_name, key, value);
        std::process::exit(0);
      }
    } else {
      result_map.insert(
        wrap_key(key),
        ElementSchema {
          extends: None,
          is_array: false,
          is_reference: false,
          require: required.contains(key),
          description: get_description_value(value),
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
        "__".to_string(),
        ElementSchema {
          description: get_description(definition),
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

async fn symbol_read(
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
      .filter_map(Value::as_str)
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

    let confirms = init_confirms(box_instance, cache, &resource_name, &definition).await?;

    return if tags.contains(&"zenbox/persistent") {
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
            description: get_description(&definition),
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
            description: get_description(&definition),
            profile: false,
            extends: Some(vec![format!("Resource<'{}'>", resource_name)]),
            schema: Some(read_keys(box_instance, cache, &resource_name, &definition).await?),
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
            description: get_description(&definition),
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            schema: None,
            plain: Some(primitive_type),
            values: None,
          },
        }))
      } else if definition.get("type").is_none() {
        let values = match definition.get("zen.fhir/value-set") {
          Some(it) => Some(
            get_value_set(
              box_instance,
              cache,
              it.get("symbol").unwrap().as_str().unwrap(),
            )
            .await?
            .iter()
            .map(|it| format!("\"{}\"", it))
            .collect(),
          ),
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
                description: get_description(&definition),
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
                description: get_description(&definition),
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
        let mut keys = read_keys(box_instance, cache, &resource_name, &definition).await?;

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
            name: String::from("Resource<T>"),
            element: Element {
              description: get_description(&definition),
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
              description: get_description(&definition),
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
      Ok(Some(ElementWrapper::new(
        resource_name.clone(),
        Element {
          description: get_description(&definition),
          profile: tags.contains(&"zen.fhir/profile-schema"),
          extends: normalize_confirms(&confirms, &resource_name),
          schema: Some(read_keys(box_instance, cache, &resource_name, &definition).await?),
          plain: None,
          values: None,
        },
      )))
    };
  }

  Ok(None)
}

#[allow(mutable_borrow_reservation_conflict)]
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
    ProgressStyle::with_template("{spinner:.cyan} [{bar:50.cyan/red}] {pos}/{len} {msg}")
      .unwrap()
      .progress_chars("✺✺"),
  );

  let mut result: HashMap<String, Element> = HashMap::new();

  for symbol in symbols.iter() {
    if let Ok(it) = symbol_read(&box_instance, cache, symbol, include_profiles).await {
      if it.is_some() {
        let new_element = it.unwrap();

        match result.get(new_element.name.as_str()) {
          Some(old_element) => {
            let merged_types = match new_element.clone().element.schema {
              Some(el) => match old_element.clone().schema {
                Some(old) => Some(deep_merge_element_schema(old, el)),
                None => Some(el),
              },
              None => old_element.schema.clone(),
            };
            result.insert(
              new_element.name.to_string(),
              Element {
                description: new_element.element.description.clone(),
                profile: new_element.element.profile,
                extends: match old_element.extends.clone() {
                  Some(it) => match new_element.element.extends.clone() {
                    Some(ri) => {
                      let extends: Vec<_> = [it.as_slice(), ri.as_slice()]
                        .concat()
                        .iter()
                        .unique()
                        .map(String::to_string)
                        .collect();

                      Some(extends)
                    },
                    None => old_element.extends.clone(),
                  },
                  None => old_element.extends.clone(),
                },
                values: old_element.values.clone(),
                plain: old_element.plain.clone(),
                schema: merged_types,
              },
            );
          },
          None => {
            result.insert(new_element.name.to_string(), new_element.element.clone());
          },
        }
      }
    };
    pb.inc(1);
  }
  pb.finish();

  println!(
    "{:#?} of {:#?} symbols processed in {:?}",
    result.len(),
    symbols.len(),
    (pb.elapsed().as_secs_f64() * 100f64).floor() / 100f64
  );

  Ok(result)
}
