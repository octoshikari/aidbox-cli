use crate::types::cache::{Cache, TypeElement, TypeElementPart, TypeElementSubType};
use crate::types::helpers::{
  convert_primitive, get_confirms, get_description, get_description_value, get_name, get_symbol,
  get_value_set, init_confirms, init_confirms_value, init_reference_confirms_value,
  is_persistent_any, is_type_and_not_map, normalize_confirms, wrap_key, zen_path_to_name,
};
use crate::types::r#box::BoxInstance;
use indicatif::{ProgressBar, ProgressStyle};
use log::{info, warn};
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;

async fn parse_vector(
  box_instance: &BoxInstance,
  cache: &mut Cache,
  resource_name: &str,
  every: &Value,
) -> Result<
  (
    bool,
    Option<String>,
    Option<HashMap<String, TypeElementSubType>>,
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
            Ok((false, Some("Array<code>".to_string()), None))
          } else {
            let target_value: Vec<_> = values.iter().map(|it| format!("\"{}\"", it)).collect();
            return Ok((
              false,
              Some(format!("Array<{}>", target_value.join(" | "))),
              None,
            ));
          }
        } else if single_confirm.unwrap() == "CodeableConcept" {
          if values.is_empty() {
            Ok((false, Some("Array<CodeableConcept>".to_string()), None))
          } else {
            let target_value: Vec<_> = values.iter().map(|it| format!("\"{}\"", it)).collect();
            return Ok((
              false,
              Some(format!(
                "Array<CodeableConcept<{}>>",
                target_value.join(" | ")
              )),
              None,
            ));
          }
        } else if single_confirm.unwrap() == "Coding" {
          if values.is_empty() {
            Ok((false, Some("Array<Coding>".to_string()), None))
          } else {
            let target_value: Vec<_> = values.iter().map(|it| format!("\"{}\"", it)).collect();
            return Ok((
              false,
              Some(format!("Array<Coding<{}>>", target_value.join(" | "))),
              None,
            ));
          }
        } else {
          Ok((false, Some("Array<any>".to_string()), None))
        }
      } else {
        Ok((false, Some("Array<any>".to_string()), None))
      }
    } else {
      Ok((false, Some("Array<any>".to_string()), None))
    }
  } else if every.get("type").is_some() {
    let nested_type = every.get("type").unwrap();
    if nested_type == "zen/string" {
      let target = match every.get("enum") {
        Some(it) => {
          let sub_target: Vec<_> = it
            .as_array()
            .unwrap()
            .iter()
            .map(|item| format!("\"{}\"", item.get("value").unwrap().as_str().unwrap()))
            .collect();
          if sub_target.is_empty() {
            "Array<string>".to_string()
          } else {
            format!("Array<{}>", sub_target.join(" | "))
          }
        },
        None => "Array<string>".to_string(),
      };

      Ok((false, Some(target), None))
    } else if nested_type == "zen/map" {
      if every.get("validation-type").is_some()
        && every.get("validation-type").unwrap().as_str().unwrap() == "open"
      {
        Ok((false, Some("Array<any>".to_string()), None))
      } else if every.get("keys").is_some() {
        let sub_type = parse_map(
          box_instance,
          cache,
          resource_name,
          every.get("keys").unwrap(),
          every.get("require"),
        )
        .await?;
        Ok((true, None, Some(sub_type)))
      } else {
        Ok((false, Some("Array<any>".to_string()), None))
      }
    } else {
      Ok((false, Some("Array<any>".to_string()), None))
    }
  } else if every
    .get("zen.fhir/reference")
    .map(|it| it.as_object())
    .map(|it| it.unwrap())
    .map(|it| it.get("refers"))
    .is_some()
  {
    let refers = init_reference_confirms_value(box_instance, cache, resource_name, every).await?;
    return Ok((
      false,
      Some(match refers.is_empty() {
        false => format!("Array<Reference<{}>>", refers.join(" | ")),
        true => "Array<Reference>".to_string(),
      }),
      None,
    ));
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
    let res = match get_confirms(box_instance, cache, confirms, resource_name).await {
      Ok(it) => it.join(" | "),
      Err(..) => "any".to_string(),
    };
    return Ok((false, Some(format!("Array<{}>", res)), None));
  } else {
    Ok((false, Some("Array<any>".to_string()), None))
  }
}

#[async_recursion::async_recursion]
async fn parse_map(
  box_instance: &BoxInstance,
  cache: &mut Cache,
  resource_name: &str,
  keys: &Value,
  require_keys: Option<&'async_recursion Value>,
) -> Result<HashMap<String, TypeElementSubType>, Box<dyn Error>> {
  let mut result_map: HashMap<String, TypeElementSubType> = HashMap::new();

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

  for val in keys.as_object().unwrap() {
    let (key, value) = val;
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

      let plain_type = match values.is_empty() {
        true => {
          let confirms = init_confirms_value(box_instance, cache, resource_name, value).await?;
          match confirms.is_empty() {
            false => Some(confirms.join(" | ")),
            true => Some("any".to_string()),
          }
        },
        _ => Some(
          values
            .iter()
            .map(|it| format!("\"{}\"", it))
            .collect::<Vec<_>>()
            .join(" | "),
        ),
      };

      result_map.insert(
        wrap_key(key),
        TypeElementSubType {
          description: get_description_value(value),
          require: required.contains(key),
          sub_type: None,
          plain_type,
          extends: None,
          array: false,
        },
      );
    } else if value.get("type").is_some() {
      if value.get("type").unwrap().as_str().unwrap() == "zen/boolean" {
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("boolean".to_string()),
            extends: None,
            array: false,
          },
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/number" {
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: value.get("zen/desc").map(|it| it.to_string()),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("number".to_string()),
            extends: None,
            array: false,
          },
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/datetime" {
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("dateTime".to_string()),
            extends: None,
            array: false,
          },
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/integer" {
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some("integer".to_string()),
            extends: None,
            array: false,
          },
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/string" {
        let target = match value.get("enum") {
          Some(it) => {
            let sub_target: Vec<_> = it
              .as_array()
              .unwrap()
              .iter()
              .map(|item| format!("\"{}\"", item.get("value").unwrap().as_str().unwrap()))
              .collect();
            if sub_target.is_empty() {
              "string".to_string()
            } else {
              sub_target.join(" | ")
            }
          },
          None => "string".to_string(),
        };
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some(target),
            extends: None,
            array: false,
          },
        );
      } else if value.get("type").is_some()
        && value.get("type").unwrap().as_str().unwrap() == "zen/vector"
      {
        let (array, plain_type, sub_type) = parse_vector(
          box_instance,
          cache,
          resource_name,
          value.get("every").unwrap(),
        )
        .await?;

        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type,
            plain_type,
            extends: None,
            array,
          },
        );
      } else if value.get("type").unwrap().as_str().unwrap() == "zen/map" {
        if value.get("validation-type").is_some() {
          if value.get("validation-type").unwrap().as_str().unwrap() == "open" {
            result_map.insert(
              wrap_key(key),
              TypeElementSubType {
                description: get_description_value(value),
                require: required.contains(key),
                sub_type: None,
                plain_type: Some("any".to_string()),
                extends: None,
                array: false,
              },
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
            let sub_type = parse_map(
              box_instance,
              cache,
              resource_name,
              value.get("keys").unwrap(),
              value.get("require"),
            )
            .await?;
            result_map.insert(
              wrap_key(key),
              TypeElementSubType {
                description: get_description_value(value),
                require: required.contains(key),
                sub_type: Some(sub_type),
                plain_type: None,
                extends: Some(sub_confirms),
                array: false,
              },
            );
          } else {
            result_map.insert(
              wrap_key(key),
              TypeElementSubType {
                description: get_description_value(value),
                require: required.contains(key),
                sub_type: None,
                plain_type: Some("any".to_string()),
                extends: None,
                array: false,
              },
            );
          }
        } else if value.get("keys").is_some() {
          let sub_type = parse_map(
            box_instance,
            cache,
            resource_name,
            value.get("keys").unwrap(),
            value.get("require"),
          )
          .await?;
          result_map.insert(
            wrap_key(key),
            TypeElementSubType {
              description: get_description_value(value),
              require: required.contains(key),
              sub_type: Some(sub_type),
              plain_type: None,
              extends: None,
              array: false,
            },
          );
        } else if value.get("values").is_some() {
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
            result_map.insert(
              wrap_key(key),
              TypeElementSubType {
                description: get_description_value(value),
                require: required.contains(key),
                sub_type: None,
                plain_type: Some("Record<string,any>".to_string()),
                extends: None,
                array: false,
              },
            );
          }
        } else if value.get("values").is_some() {
          if value.get("values").unwrap().get("keys").is_some() {
            let sub_type = parse_map(
              box_instance,
              cache,
              resource_name,
              value.get("keys").unwrap(),
              value.get("require"),
            )
            .await?;
            result_map.insert(
              wrap_key(key),
              TypeElementSubType {
                description: get_description_value(value),
                require: required.contains(key),
                sub_type: Some(sub_type),
                plain_type: None,
                extends: None,
                array: false,
              },
            );
          }
        } else {
          result_map.insert(
            wrap_key(key),
            TypeElementSubType {
              description: get_description_value(value),
              require: required.contains(key),
              sub_type: None,
              plain_type: Some("any".to_string()),
              extends: None,
              array: false,
            },
          );
        }
      } else {
        warn!("Unknown value/type - {:#?} {:#?}", key, value)
      }
    } else if value.get("type").is_none() && value.get("confirms").is_some() {
      if value
        .get("zen.fhir/reference")
        .map(|it| it.as_object())
        .map(|it| it.unwrap())
        .map(|it| it.get("refers"))
        .is_some()
      {
        let refers =
          init_reference_confirms_value(box_instance, cache, resource_name, value).await?;
        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some(match refers.is_empty() {
              false => format!("Reference<{}>", refers.join(" | ")),
              true => "Reference".to_string(),
            }),
            extends: None,
            array: false,
          },
        );
      } else {
        let sub_confirms = init_confirms_value(box_instance, cache, resource_name, value).await?;

        result_map.insert(
          wrap_key(key),
          TypeElementSubType {
            description: get_description_value(value),
            require: required.contains(key),
            sub_type: None,
            plain_type: Some(match sub_confirms.is_empty() {
              false => sub_confirms.join(" | "),
              true => "any".to_string(),
            }),
            extends: None,
            array: false,
          },
        );
      }
    } else if value.get("type").is_none() {
      result_map.insert(
        wrap_key(key),
        TypeElementSubType {
          description: get_description_value(value),
          require: required.contains(key),
          sub_type: None,
          plain_type: Some("any".to_string()),
          extends: None,
          array: false,
        },
      );
    } else {
      info!("Parse map: unknown case {:#?} {:#?}", key, value)
    }
  }

  Ok(result_map)
}

async fn prepare_keys(
  box_instance: &BoxInstance,
  cache: &mut Cache,
  resource_name: &str,
  definition: &HashMap<String, Value>,
) -> Result<HashMap<String, TypeElementSubType>, Box<dyn Error>> {
  match definition.get("keys") {
    Some(keys) => {
      let type_map = parse_map(
        box_instance,
        cache,
        resource_name,
        keys,
        definition.get("require"),
      )
      .await?;
      Ok(type_map)
    },
    None => {
      let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();

      type_map.insert(
        "[key: string]".to_string(),
        TypeElementSubType {
          description: definition
            .get("zen/desc")
            .map(|it| it.as_str().unwrap().to_string()),
          require: false,
          sub_type: None,
          plain_type: Some(String::from("any")),
          extends: None,
          array: false,
        },
      );
      Ok(type_map)
    },
  }
}

async fn parse_symbol(
  box_instance: &BoxInstance,
  cache: &mut Cache,
  symbol: &String,
  include_profiles: bool,
) -> Result<Option<TypeElement>, Box<dyn Error>> {
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

    let confirms = init_confirms(box_instance, cache, &resource_name, &definition).await?;

    if tags.len() == 1 && tags[0] == "zen/schema" {
      return if !tags.contains(&"zenbox/Resource") {
        if definition.get("keys").is_none() {
          warn!("No keys in simple schema {} {:#?}", symbol, definition);
          Ok(None)
        } else {
          Ok(Some(TypeElement {
            name: resource_name.clone(),
            element: TypeElementPart {
              description: get_description(&definition),
              sub_type: Some(prepare_keys(box_instance, cache, &resource_name, &definition).await?),
              source: true,
              profile: false,
              extends: normalize_confirms(&confirms, &resource_name),
              plain_type: None,
            },
          }))
        }
      } else {
        warn!("Unknown simple schema {} {:#?}", symbol, definition);
        Ok(None)
      };
    } else if tags.contains(&"zenbox/persistent") {
      return if is_persistent_any(&definition) {
        let mut sub_type = HashMap::new();
        sub_type.insert(
          "[key: string]".to_string(),
          TypeElementSubType {
            array: false,
            require: false,
            extends: None,
            plain_type: Some("any".to_string()),
            sub_type: None,
            description: None,
          },
        );
        Ok(Some(TypeElement {
          name: resource_name.clone(),
          element: TypeElementPart {
            description: get_description(&definition),
            sub_type: Some(sub_type),
            source: true,
            profile: false,
            extends: normalize_confirms(&confirms, &resource_name),
            plain_type: None,
          },
        }))
      } else {
        Ok(Some(TypeElement {
          name: resource_name.clone(),
          element: TypeElementPart {
            description: get_description(&definition),
            sub_type: Some(prepare_keys(box_instance, cache, &resource_name, &definition).await?),
            source: true,
            profile: false,
            extends: Some(vec![format!("Resource<'{}'>", resource_name)]),
            plain_type: None,
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
        return Ok(Some(TypeElement {
          name: resource_name.clone(),
          element: TypeElementPart {
            description: get_description(&definition),
            sub_type: None,
            source: true,
            profile: false,
            extends: None,
            plain_type: Some(primitive_type),
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
            Ok(Some(TypeElement {
              name: resource_name.clone(),
              element: TypeElementPart {
                description: get_description(&definition),
                sub_type: None,
                source: true,
                profile: false,
                extends: normalize_confirms(&confirms, &resource_name),
                plain_type: None,
              },
            }))
          } else {
            Ok(Some(TypeElement {
              name: zen_path_to_name(&definition["zen/name"]),
              element: TypeElementPart {
                description: get_description(&definition),
                sub_type: None,
                source: true,
                profile: false,
                extends: normalize_confirms(&confirms, &resource_name),
                plain_type: None,
              },
            }))
          };
        }
      } else {
        let mut keys = prepare_keys(box_instance, cache, &resource_name, &definition).await?;
        return if resource_name == "Resource" {
          keys.insert(
            "resourceType".to_string(),
            TypeElementSubType {
              description: None,
              require: true,
              sub_type: None,
              plain_type: Some("T".to_string()),
              extends: None,
              array: false,
            },
          );
          Ok(Some(TypeElement {
            name: String::from("Resource<T>"),
            element: TypeElementPart {
              description: get_description(&definition),
              sub_type: Some(keys),
              source: true,
              profile: false,
              extends: None,
              plain_type: None,
            },
          }))
        } else if resource_name == "DomainResource" {
          Ok(Some(TypeElement {
            name: String::from("DomainResource"),
            element: TypeElementPart {
              description: get_description(&definition),
              sub_type: Some(keys),
              source: true,
              extends: None,
              profile: false,
              plain_type: None,
            },
          }))
        } else {
          Ok(Some(TypeElement {
            name: resource_name.clone(),
            element: TypeElementPart {
              description: get_description(&definition),
              sub_type: Some(keys),
              source: true,
              profile: false,
              extends: normalize_confirms(&confirms, &resource_name),
              plain_type: None,
            },
          }))
        };
      }
    } else {
      return Ok(Some(type_ok(
        resource_name.clone(),
        definition.clone(),
        confirms,
        tags.contains(&"zen.fhir/profile-schema"),
        prepare_keys(box_instance, cache, resource_name.as_str(), &definition).await?,
      )));
    }
  }
  Ok(None)
}

fn type_ok(
  resource_name: String,
  definition: HashMap<String, Value>,
  confirms: Vec<String>,
  profile: bool,
  keys: HashMap<String, TypeElementSubType>,
) -> TypeElement {
  TypeElement {
    name: resource_name.to_owned(),
    element: TypeElementPart {
      description: get_description(&definition),
      sub_type: Some(keys),
      source: true,
      profile,
      extends: normalize_confirms(&confirms, &resource_name),
      plain_type: None,
    },
  }
}

pub async fn generate_types(
  box_instance: BoxInstance,
  cache: &mut Cache,
  include_profiles: bool,
) -> Result<HashMap<String, TypeElementPart>, Box<dyn Error>> {
  info!("Start load symbols...");
  let symbols = match box_instance
    .load_all_symbols(cache.cache_enabled, &cache.cache_path)
    .await
  {
    Ok(it) => it,
    Err(err) => return Err(err),
  };
  let pb = ProgressBar::new(symbols.len() as u64);
  pb.set_style(
    ProgressStyle::with_template("{spinner:.green} [{elapsed}] [{bar:40.cyan/red}] ({pos}/{len})")
      .unwrap()
      .progress_chars("#>-"),
  );

  let mut result: Vec<TypeElement> = Vec::new();

  for symbol in symbols.iter() {
    if let Ok(it) = parse_symbol(&box_instance, cache, symbol, include_profiles).await {
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

  let mut result_types: HashMap<String, TypeElementPart> = HashMap::new();

  result.iter().for_each(
    |new_element| match result_types.get(new_element.name.as_str()) {
      Some(old_element) => {
        if new_element.element.profile {
          let merged_types = match old_element.sub_type.is_some() {
            true => match new_element.element.sub_type.is_some() {
              true => Some(deep_merge_sub_type(
                old_element.sub_type.clone().unwrap(),
                new_element.element.sub_type.clone().unwrap(),
              )),
              false => old_element.sub_type.clone(),
            },
            false => new_element.element.sub_type.clone(),
          };

          result_types.insert(
            new_element.name.to_string(),
            TypeElementPart {
              description: new_element.element.description.clone(),
              sub_type: merged_types,
              source: true,
              profile: new_element.element.profile,
              extends: new_element.element.extends.clone(),
              plain_type: new_element.element.plain_type.clone(),
            },
          )
        } else {
          let merged_types = match new_element.element.sub_type.is_some() {
            true => match new_element.element.sub_type.is_some() {
              true => Some(deep_merge_sub_type(
                new_element.element.sub_type.clone().unwrap(),
                old_element.sub_type.clone().unwrap(),
              )),
              false => new_element.element.sub_type.clone(),
            },
            false => old_element.sub_type.clone(),
          };
          result_types.clone().insert(
            new_element.name.to_string(),
            TypeElementPart {
              description: old_element.description.clone(),
              sub_type: merged_types,
              source: false,
              profile: old_element.profile,
              extends: old_element.extends.clone(),
              plain_type: old_element.plain_type.clone(),
            },
          )
        };
      },
      None => {
        result_types.insert(new_element.name.to_string(), new_element.element.clone());
      },
    },
  );

  Ok(result_types)
}

fn deep_merge_sub_type(
  left: HashMap<String, TypeElementSubType>,
  right: HashMap<String, TypeElementSubType>,
) -> HashMap<String, TypeElementSubType> {
  return if left == right {
    right
  } else {
    let mut new_result: HashMap<String, TypeElementSubType> = HashMap::new();
    for (key, value) in left {
      match right.get(key.as_str()).is_some() {
        true => {
          let element = right.get(key.as_str()).unwrap().to_owned();
          if value == element {
            new_result.insert(key, value);
          } else {
            let merged_types = match element.sub_type.is_some() {
              true => match value.sub_type.is_some() {
                true => Some(deep_merge_sub_type(
                  value.sub_type.clone().unwrap(),
                  element.sub_type.clone().unwrap(),
                )),
                false => element.sub_type.clone(),
              },
              false => element.sub_type.clone(),
            };

            new_result.insert(
              key,
              TypeElementSubType {
                description: element.description,
                require: element.require,
                sub_type: merged_types,
                plain_type: element.plain_type,
                extends: element.extends,
                array: element.array,
              },
            );
          }
        },
        false => {
          //
          new_result.insert(key, value);
        },
      }
    }
    new_result
  };
}
