use crate::types::cache::{Cache, TypeElement, TypeElementPart, TypeElementSubType};
use crate::types::r#box::BoxInstance;
use indicatif::{ProgressBar, ProgressStyle};
use log::{info, warn};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::error::Error;

fn normalize_confirms(confirms: &[String], resource_name: &str) -> Option<Vec<String>> {
    return if confirms.is_empty()
        || (confirms.len() == 1 && confirms.get(0).unwrap().as_str() == resource_name)
    {
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

/// Get target symbol from cache or retrieve by Aidbox API and store in cache
async fn get_symbol(
    box_instance: &BoxInstance,
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

/// Get value set from cache or retrieve by Aidbox API and store in cache
async fn get_value_set(
    box_instance: &BoxInstance,
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

fn capitalize(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().chain(c).collect(),
    }
}

fn kebab_to_camel(item: &str) -> String {
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

fn zen_path_to_name(def: &Value) -> String {
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

fn get_name(element: HashMap<String, Value>) -> String {
    if element.get("zen.fhir/type").is_some() {
        return element
            .get("zen.fhir/type")
            .unwrap()
            .as_str()
            .unwrap()
            .to_string();
    }
    if element.get("resourceType").is_some() {
        return element
            .get("resourceType")
            .unwrap()
            .as_str()
            .unwrap()
            .to_string();
    }
    return zen_path_to_name(element.get("zen/name").unwrap());
}

async fn get_confirms(
    box_instance: &BoxInstance,
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
                }
                Some(it) => it.to_owned(),
            };
            if element.get("fhir/polymorphic").is_none() {
                let name = get_name(element.to_owned());
                cache
                    .confirms
                    .insert(confirm.to_string(), serde_json::to_value(&name).unwrap());
                result.insert(name.to_string());
            } else {
                // TODO: Need understand how ot process this
            }
        }
    }
    Ok(result
        .iter()
        .map(|item| match "Resource" == item {
            true => format!("Resource<'{}'>", resource_name),
            _ => item.to_string(),
        })
        .collect())
}

fn wrap_key(source: &str) -> String {
    return if source.contains('-') {
        format!("'{}'", source)
    } else {
        source.to_string()
    };
}

async fn parse_vector(
    box_instance: &BoxInstance,
    cache: &mut Cache,
    resource_name: &str,
    keys: &Value,
) {
    info!("fsdfsdf");
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
            info!(
                "{} and values {:#?} and require {:#?}",
                key, values, required
            );

            let plain_type = match values.is_empty() {
                true => {
                    let confirms = match value.get("confirms") {
                        Some(it) => it
                            .as_array()
                            .unwrap()
                            .iter()
                            .filter_map(|item| item.as_str())
                            .collect(),
                        _ => vec![],
                    };
                    let res = match get_confirms(box_instance, cache, confirms, resource_name).await
                    {
                        Ok(it) => Some(it.join(" | ")),
                        Err(..) => Some("any".to_string()),
                    };
                    res
                }
                _ => Some(
                    values
                        .iter()
                        .map(|it| format!("'{}'", it))
                        .collect::<Vec<_>>()
                        .join(" | "),
                ),
            };

            result_map.insert(
                wrap_key(key),
                TypeElementSubType {
                    description: value.get("zen/desc").map(|it| it.to_string()),
                    require: Some(required.contains(key)),
                    sub_type: None,
                    plain_type,
                    extends: None,
                    array: None,
                },
            );
        } else if value.get("type").is_some() {
            if value.get("type").unwrap().as_str().unwrap() == "zen/boolean" {
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some("boolean".to_string()),
                        extends: None,
                        array: None,
                    },
                );
            } else if value.get("type").unwrap().as_str().unwrap() == "zen/number" {
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some("number".to_string()),
                        extends: None,
                        array: None,
                    },
                );
            } else if value.get("type").unwrap().as_str().unwrap() == "zen/datetime" {
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some("dateTime".to_string()),
                        extends: None,
                        array: None,
                    },
                );
            } else if value.get("type").unwrap().as_str().unwrap() == "zen/integer" {
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some("integer".to_string()),
                        extends: None,
                        array: None,
                    },
                );
            } else if value.get("type").unwrap().as_str().unwrap() == "zen/string" {
                let target = match value.get("enum") {
                    Some(it) => {
                        let sub_target: Vec<_> = it
                            .as_array()
                            .unwrap()
                            .iter()
                            .map(|item| {
                                format!("'{}'", item.get("value").unwrap().as_str().unwrap())
                            })
                            .collect();
                        if sub_target.is_empty() {
                            "string".to_string()
                        } else {
                            sub_target.join(" | ")
                        }
                    }
                    None => "string".to_string(),
                };
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some(target),
                        extends: None,
                        array: None,
                    },
                );
            } else if value.get("type").is_some()
                && value.get("type").unwrap().as_str().unwrap() == "zen/vector"
            {
                // let (array, plain_type, sub_type) =
                //     parse_vector(box_instance, cache, resource_name, value.get("every")).await?;

                // result_map.insert(
                //     wrap_key(key),
                //     TypeElementSubType {
                //         description: value.get("zen/desc").map(|it| it.to_string()),
                //         require: Some(required.contains(key)),
                //         sub_type,
                //         plain_type,
                //         extends: None,
                //         array,
                //     },
                // );
            } else if value.get("type").unwrap().as_str().unwrap() == "zen/map" {
                if value.get("validation-type").is_some() {
                    if value.get("validation-type").unwrap().as_str().unwrap() == "open" {
                        result_map.insert(
                            wrap_key(key),
                            TypeElementSubType {
                                description: value.get("zen/desc").map(|it| it.to_string()),
                                require: Some(required.contains(key)),
                                sub_type: None,
                                plain_type: Some("any".to_string()),
                                extends: None,
                                array: None,
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
                                description: value.get("zen/desc").map(|it| it.to_string()),
                                require: Some(required.contains(key)),
                                sub_type: Some(sub_type),
                                plain_type: None,
                                extends: Some(sub_confirms),
                                array: None,
                            },
                        );
                    } else {
                        result_map.insert(
                            wrap_key(key),
                            TypeElementSubType {
                                description: value.get("zen/desc").map(|it| it.to_string()),
                                require: Some(required.contains(key)),
                                sub_type: None,
                                plain_type: Some("any".to_string()),
                                extends: None,
                                array: None,
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
                            description: value.get("zen/desc").map(|it| it.to_string()),
                            require: Some(required.contains(key)),
                            sub_type: Some(sub_type),
                            plain_type: None,
                            extends: None,
                            array: None,
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
                                description: value.get("zen/desc").map(|it| it.to_string()),
                                require: Some(required.contains(key)),
                                sub_type: None,
                                plain_type: Some("Record<string,any>".to_string()),
                                extends: None,
                                array: None,
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
                                description: value.get("zen/desc").map(|it| it.to_string()),
                                require: Some(required.contains(key)),
                                sub_type: Some(sub_type),
                                plain_type: None,
                                extends: None,
                                array: None,
                            },
                        );
                    }
                } else {
                    result_map.insert(
                        wrap_key(key),
                        TypeElementSubType {
                            description: value.get("zen/desc").map(|it| it.to_string()),
                            require: Some(required.contains(key)),
                            sub_type: None,
                            plain_type: Some("any".to_string()),
                            extends: None,
                            array: None,
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
                let sub_confirms: Vec<_> = value
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

                let refers = get_confirms(box_instance, cache, sub_confirms, resource_name).await?;
                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some(match refers.is_empty() {
                            false => format!("Reference<{}>", refers.join(" | ")),
                            true => "Reference".to_string(),
                        }),
                        extends: None,
                        array: None,
                    },
                );
            } else {
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

                result_map.insert(
                    wrap_key(key),
                    TypeElementSubType {
                        description: value.get("zen/desc").map(|it| it.to_string()),
                        require: Some(required.contains(key)),
                        sub_type: None,
                        plain_type: Some(match sub_confirms.is_empty() {
                            false => sub_confirms.join(" | "),
                            true => "any".to_string(),
                        }),
                        extends: None,
                        array: None,
                    },
                );
            }
        } else if value.get("type").is_none() {
            result_map.insert(
                wrap_key(key),
                TypeElementSubType {
                    description: value.get("zen/desc").map(|it| it.to_string()),
                    require: Some(required.contains(key)),
                    sub_type: None,
                    plain_type: Some("any".to_string()),
                    extends: None,
                    array: None,
                },
            );
        } else {
            info!("Parse map: unknown case {:#?} {:#?}", key, value)
        }
    }

    Ok(result_map)
}

/*

export const parseVector = async (
  box: Box,
  cache: Cache,
  resourceName: string,
  vector: Exclude<ZenSchemaKeys["every"], undefined> = {},
): Promise<string | Record<string, TypesElementPart>> => {
  if (vector["zen.fhir/value-set"]) {
    const values = await getValueset(
      box,
      cache,
      vector["zen.fhir/value-set"].symbol,
    );
    if (vector.confirms) {
      const [confirm] = await getConfirms(
        box,
        cache,
        vector.confirms,
        resourceName,
      );
      if (confirm === "code") {
        return (
          values.map((v: string) => `"${v}"`).join(" | ") ||
          confirm ||
          "confirm-vector-any"
        );
      } else if (confirm === "CodeableConcept") {
        return `CodeableConcept<${
          values.map((v: string) => `"${v}"`).join(" | ") ||
          confirm ||
          "confirm-vector-any"
        }>`;
      } else if (confirm === "Coding") {
        return `Coding<${
          values.map((v: string) => `"${v}"`).join(" | ") ||
          confirm ||
          "confirm-vector-any"
        }>`;
      } else {
        return "confirm-vector-any";
      }
    } else {
      return "confirm-vector-any";
    }
  } else if (vector?.type === "zen/string") {
    return vector?.enum
      ? vector?.enum.map((e) => `"${e.value}"`).join(" | ")
      : "string";
  } else if (vector?.type === "zen/map") {
    if (vector?.keys) {
      return parseMap(box, cache, resourceName, vector.keys, vector.require);
    } else if (vector["validation-type"] === "open") {
      return "any";
    } else {
      // readerLog("vector map problem", vector);
      return "any";
    }
  } else if (vector?.["zen.fhir/reference"]?.refers) {
    const refers = await getConfirms(
      box,
      cache,
      vector["zen.fhir/reference"]?.refers,
      resourceName,
    );
    return refers?.length
      ? `Reference<'${refers.join("' | '")}'>`
      : `Reference`;
  } else if (!vector?.type && vector?.confirms) {
    return (await getConfirms(box, cache, vector.confirms, resourceName)).join(
      " | ",
    );
  } else if (
    !vector?.type &&
    !vector.confirms &&
    !vector["zen.fhir/reference"]
  ) {
    return "any";
  } else {
    console.log("inside vector", vector);
    cache.save();
    process.exit(1);
    return "";
  }
};

};


*/
async fn parse_symbol(
    box_instance: &BoxInstance,
    cache: &mut Cache,
    symbol: &String,
    include_profiles: bool,
) -> Result<Option<TypeElement>, Box<dyn Error>> {
    let definition = get_symbol(box_instance, cache, symbol).await?;
    if definition.get("zen/tags").is_some() {
        let tags: Vec<_> = definition
            .get("zen/tags")
            .unwrap()
            .as_array()
            .unwrap()
            .iter()
            .filter_map(|item| item.as_str())
            .collect();

        if tags.contains(&"zen.fhir/profile-schema") && !include_profiles {
            return Ok(None);
        }
        if tags.contains(&"zen.fhir/search") {
            return Ok(None);
        }
        if tags.contains(&"zenbox/rpc") {
            return Ok(None);
        }

        let resource_name = get_name(definition.clone());

        if resource_name == "Reference" {
            return Ok(None);
        }

        let pre_confirms = definition.get("confirms");
        let confirms = match pre_confirms {
            Some(it) => {
                get_confirms(
                    box_instance,
                    cache,
                    it.as_array()
                        .unwrap()
                        .iter()
                        .filter_map(|item| item.as_str())
                        .collect(),
                    &resource_name,
                )
                .await?
            }
            _ => vec![],
        };
        if tags.len() == 1 && tags.get(0).unwrap() == &"zen/schema" {
            return if !tags.contains(&"zenbox/Resource") {
                if definition.get("keys").is_none() {
                    warn!("No keys in simple schema {} {:#?}", symbol, definition);
                    Ok(None)
                } else {
                    let result_keys = match definition.get("keys") {
                        Some(keys) => {
                            let type_map = parse_map(
                                box_instance,
                                cache,
                                &resource_name,
                                keys,
                                definition.get("require"),
                            )
                            .await?;
                            type_map
                        }
                        None => {
                            let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();

                            type_map.insert(
                                "[key: string]".to_string(),
                                TypeElementSubType {
                                    description: definition
                                        .get("zen/desc")
                                        .map(|it| it.to_string()),
                                    require: Some(false),
                                    sub_type: None,
                                    plain_type: Some(String::from("any")),
                                    extends: None,
                                    array: None,
                                },
                            );
                            type_map
                        }
                    };

                    Ok(Some(TypeElement {
                        name: resource_name.clone(),
                        element: TypeElementPart {
                            description: definition.get("zen/desc").map(|it| it.to_string()),
                            sub_type: Some(result_keys),
                            source: Some(true),
                            extends: normalize_confirms(&confirms, &resource_name),
                            plain_type: None,
                        },
                    }))
                }
            } else {
                info!("Unknown simple schema {} {:#?}", symbol, definition);
                Ok(None)
            };
        }

        return Ok(None);
    }

    Ok(None)
}

/*
export const parseSymbol = async (
  box: Box,
  cache: Cache,
  symbol: string,
  includeProfile: boolean,
): Promise<TypesElement | undefined> => {

  } else if (
    definition["zen/tags"].includes("zenbox/persistent") &&
    (definition["validation-type"] === "open" ||
      definition["values"]?.type === "zen/any")
  ) {
    return {
      desc: definition["zen/desc"],
      name,
      ...normalizeConfirms(confirms, name),
      defs: { "[key:string]": { type: "any", require: true } },
    };
  } else if (definition["zen/tags"].includes("zenbox/persistent")) {
    return {
      desc: definition["zen/desc"],
      name,
      extends: [`Resource<'${name}'>`],
      defs: await parseMap(
        box,
        cache,
        name,
        definition.keys,
        definition.require,
      ),
    };
  } else if (definition["zen/tags"].includes("zen.fhir/structure-schema")) {
    if (definition?.type && definition["type"] !== "zen/map") {
      const newName = .thToName(definition["zen/name"]) || "";

      const inlineType = convertPrimitive(definition["type"]);

      if (!cache.primitives.get(newName)) {
        cache.primitives.set(newName, inlineType);
      }
      return {
        desc: definition["zen/desc"],
        name: newName,
        type: inlineType,
      };
    } else if (
      definition["zen/tags"].includes("zen.fhir/structure-schema") &&
      !definition["type"]
    ) {
      if (!definition["zen/name"].split(".")[1].includes("-")) {
        if (confirms.join(", ") !== name) {
          return {
            desc: definition["zen/desc"],
            name,
            ...normalizeConfirms(confirms, name),
          };
        } else {
          const newName = .thToName(definition["zen/name"]);

          return {
            desc: definition["zen/desc"],
            name: newName,
            ...normalizeConfirms(confirms, newName),
          };
        }
      } else {
        // console.log("strange thing", symbol, definition);
      }
    } else {
      if (name === "Resource") {
        return {
          desc: definition["zen/desc"],
          name: "Resource<T>",
          defs: {
            ...(await parseMap(
              box,
              cache,
              name,
              definition.keys,
              definition.require,
            )),
            resourceType: { type: "T" },
          },
        };
      } else if (name === "DomainResource") {
        return {
          desc: definition["zen/desc"],
          name: "DomainResource",
          defs: await parseMap(
            box,
            cache,
            name,
            definition.keys,
            definition.require,
          ),
        };
      }
      return {
        desc: definition["zen/desc"],
        name,
        ...normalizeConfirms(confirms, name),
        defs: await parseMap(
          box,
          cache,
          name,
          definition.keys,
          definition.require,
        ),
      };
    }
  } else {
    return {
      source: !definition["zen/tags"].includes("zen.fhir/profile-schema"),
      desc: definition["zen/desc"],
      name,
      ...normalizeConfirms(confirms, name),
      defs: await parseMap(
        box,
        cache,
        name,
        definition.keys,
        definition.require,
      ),
    };
  }
  return;
};
*/

pub async fn generate_types(
    box_instance: BoxInstance,
    cache: &mut Cache,
    include_profiles: bool,
) -> Result<HashMap<String, TypeElement>, Box<dyn Error>> {
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
        ProgressStyle::with_template(
            "{spinner:.green} [{elapsed}] [{bar:40.cyan/red}] ({pos}/{len})",
        )
        .unwrap()
        .progress_chars("#>-"),
    );

    let mut result = Vec::new();

    for symbol in symbols.iter() {
        let definition = match parse_symbol(&box_instance, cache, symbol, include_profiles).await {
            Ok(it) => it,
            _ => None,
        };
        if definition.is_some() {
            info!("{:#?}", definition);

            result.push(definition.unwrap());
        }
        pb.inc(1);
    }

    pb.finish();

    info!("{:#?} of {:#?}", result.len(), symbols.len());

    info!(
        "Symbols processed in {:?}s",
        (pb.elapsed().as_secs_f64() * 100f64).floor() / 100f64
    );

    let mut types = HashMap::new();
    types.insert(
        "test".to_string(),
        TypeElement {
            name: "test".to_string(),
            element: TypeElementPart {
                description: Some("test".to_string()),
                sub_type: None,
                source: None,
                extends: None,
                plain_type: None,
            },
        },
    );

    match cache.save_intermediate_types(&types) {
        Ok(..) | Err(..) => {}
    }

    match cache.save() {
        Ok(..) | Err(..) => {}
    }

    Ok(types)
}

/*
export const generateTypes = async (
  box: Box,
  cache: Cache,
  includeProfile: boolean,
): Promise<Types> => {

  const finalResult = result.reduce(
    (accumulator: Types, current: TypesElement) => {
      const { name, ...rest } = current;
      if (accumulator[name]) {
        if (rest.source) {
          return {
            ...accumulator,
            [name]: merge<TypesElementPart[]>(rest, accumulator[name]),
          };
        } else {
          return {
            ...accumulator,
            [name]: merge<TypesElementPart[]>(accumulator[name], rest),
          };
        }
      }
      return { ...accumulator, [name]: rest };
    },
    {},
  );
  return finalResult;
};


*/
