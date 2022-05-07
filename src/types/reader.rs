use crate::types::cache::{Cache, TypeElement, TypeElementPart, TypeElementSubType};
use crate::types::helpers::{
    convert_primitive, get_confirms, get_definition, get_name, get_symbol, get_value_set,
    init_confirms, normalize_confirms, wrap_key,
};
use crate::types::r#box::BoxInstance;
use indicatif::{ProgressBar, ProgressStyle};
use log::{info, warn};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::error::Error;

async fn parse_vector(
    box_instance: &BoxInstance,
    cache: &mut Cache,
    resource_name: &str,
    every: &Value,
) -> Result<
    (
        Option<bool>,
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
            let confirms = match every.get("confirms") {
                Some(it) => it
                    .as_array()
                    .unwrap()
                    .iter()
                    .filter_map(|item| item.as_str())
                    .collect(),
                _ => vec![],
            };
            let confirm = get_confirms(box_instance, cache, confirms, resource_name).await?;

            let single_confirm = confirm.get(0);
            if single_confirm.is_some() {
                if single_confirm.unwrap() == "code" {
                    if values.is_empty() {
                        Ok((None, Some("Array<code>".to_string()), None))
                    } else {
                        let target_value: Vec<_> =
                            values.iter().map(|it| format!("'{}'", it)).collect();
                        return Ok((
                            None,
                            Some(format!("Array<{}>", target_value.join(" | "))),
                            None,
                        ));
                    }
                } else if single_confirm.unwrap() == "CodeableConcept" {
                    if values.is_empty() {
                        Ok((None, Some("Array<CodeableConcept>".to_string()), None))
                    } else {
                        let target_value: Vec<_> =
                            values.iter().map(|it| format!("'{}'", it)).collect();
                        return Ok((
                            None,
                            Some(format!(
                                "Array<CodeableConcept<{}>>",
                                target_value.join(" | ")
                            )),
                            None,
                        ));
                    }
                } else if single_confirm.unwrap() == "Coding" {
                    if values.is_empty() {
                        Ok((None, Some("Array<Coding>".to_string()), None))
                    } else {
                        let target_value: Vec<_> =
                            values.iter().map(|it| format!("'{}'", it)).collect();
                        return Ok((
                            None,
                            Some(format!(
                                "Array<CodeableCoding<{}>>",
                                target_value.join(" | ")
                            )),
                            None,
                        ));
                    }
                } else {
                    Ok((None, Some("Array<any>".to_string()), None))
                }
            } else {
                Ok((None, Some("Array<any>".to_string()), None))
            }
        } else {
            Ok((None, Some("Array<any>".to_string()), None))
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
                        .map(|item| format!("'{}'", item.get("value").unwrap().as_str().unwrap()))
                        .collect();
                    if sub_target.is_empty() {
                        "Array<string>".to_string()
                    } else {
                        format!("Array<{}>", sub_target.join(" | "))
                    }
                }
                None => "Array<string>".to_string(),
            };

            Ok((None, Some(target), None))
        } else if nested_type == "zen/map" {
            if every.get("validation-type").is_some()
                && every.get("validation-type").unwrap().as_str().unwrap() == "open"
            {
                Ok((None, Some("Array<any>".to_string()), None))
            } else if every.get("keys").is_some() {
                let sub_type = parse_map(
                    box_instance,
                    cache,
                    resource_name,
                    every.get("keys").unwrap(),
                    every.get("require"),
                )
                .await?;
                Ok((Some(true), None, Some(sub_type)))
            } else {
                Ok((None, Some("Array<any>".to_string()), None))
            }
        } else {
            Ok((None, Some("Array<any>".to_string()), None))
        }
    } else if every
        .get("zen.fhir/reference")
        .map(|it| it.as_object())
        .map(|it| it.unwrap())
        .map(|it| it.get("refers"))
        .is_some()
    {
        let sub_confirms: Vec<_> = every
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
        return Ok((
            None,
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
        return Ok((None, Some(format!("Array<{}>", res)), None));
    } else {
        Ok((None, Some("Array<any>".to_string()), None))
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
                    description: value
                        .get("zen/desc")
                        .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
                        require: Some(required.contains(key)),
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
                                description: value
                                    .get("zen/desc")
                                    .map(|it| it.as_str().unwrap().to_string()),
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
                                description: value
                                    .get("zen/desc")
                                    .map(|it| it.as_str().unwrap().to_string()),
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
                                description: value
                                    .get("zen/desc")
                                    .map(|it| it.as_str().unwrap().to_string()),
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
                            description: value
                                .get("zen/desc")
                                .map(|it| it.as_str().unwrap().to_string()),
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
                                description: value
                                    .get("zen/desc")
                                    .map(|it| it.as_str().unwrap().to_string()),
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
                                description: value
                                    .get("zen/desc")
                                    .map(|it| it.as_str().unwrap().to_string()),
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
                            description: value
                                .get("zen/desc")
                                .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                        description: value
                            .get("zen/desc")
                            .map(|it| it.as_str().unwrap().to_string()),
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
                    description: value
                        .get("zen/desc")
                        .map(|it| it.as_str().unwrap().to_string()),
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
                &resource_name,
                keys,
                definition.get("require"),
            )
            .await?;
            Ok(type_map)
        }
        None => {
            let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();

            type_map.insert(
                "[key: string]".to_string(),
                TypeElementSubType {
                    description: definition
                        .get("zen/desc")
                        .map(|it| it.as_str().unwrap().to_string()),
                    require: Some(false),
                    sub_type: None,
                    plain_type: Some(String::from("any")),
                    extends: None,
                    array: None,
                },
            );
            Ok(type_map)
        }
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
                    let result_keys =
                        prepare_keys(box_instance, cache, &resource_name, &definition).await?;

                    Ok(Some(TypeElement {
                        name: resource_name.clone(),
                        element: TypeElementPart {
                            description: get_definition(&definition),
                            sub_type: Some(result_keys),
                            source: Some(true),
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
            info!("{:?}", definition);
        } else {
            // info!("{:?}", definition);
        }
        // else if tags.contains(&"zenbox/persistent") {
        //     if (definition.get("validation-type").is_some()
        //         && definition.get("validation-type").unwrap().as_str().unwrap() == "open")
        //         || (definition.get("values").is_some()
        //             && definition.get("values").unwrap().get("type").is_some()
        //             && definition
        //                 .get("values")
        //                 .unwrap()
        //                 .get("type")
        //                 .unwrap()
        //                 .as_str()
        //                 .unwrap()
        //                 == "zen/any")
        //     {
        //         let mut sub_type = HashMap::new();
        //         sub_type.insert(
        //             "[key: string]".to_string(),
        //             TypeElementSubType {
        //                 array: None,
        //                 require: None,
        //                 extends: None,
        //                 plain_type: Some("any".to_string()),
        //                 sub_type: None,
        //                 description: None,
        //             },
        //         );
        //         return Ok(Some(TypeElement {
        //             name: resource_name.clone(),
        //             element: TypeElementPart {
        //                 description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                 sub_type: Some(sub_type),
        //                 source: Some(true),
        //                 extends: normalize_confirms(&confirms, &resource_name),
        //                 plain_type: None,
        //             },
        //         }));
        //     } else {
        //         let result_keys = match definition.get("keys") {
        //             Some(keys) => {
        //                 let type_map = parse_map(
        //                     box_instance,
        //                     cache,
        //                     &resource_name,
        //                     keys,
        //                     definition.get("require"),
        //                 )
        //                 .await?;
        //                 type_map
        //             }
        //             None => {
        //                 let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();
        //
        //                 type_map.insert(
        //                     "[key: string]".to_string(),
        //                     TypeElementSubType {
        //                         description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                         require: Some(false),
        //                         sub_type: None,
        //                         plain_type: Some(String::from("any")),
        //                         extends: None,
        //                         array: None,
        //                     },
        //                 );
        //                 type_map
        //             }
        //         };
        //
        //         return Ok(Some(TypeElement {
        //             name: resource_name.clone(),
        //             element: TypeElementPart {
        //                 description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                 sub_type: Some(result_keys),
        //                 source: Some(true),
        //                 extends: Some(vec![format!("Resource<{}>", resource_name)]),
        //                 plain_type: None,
        //             },
        //         }));
        //     }
        // } else if tags.contains(&"zen.fhir/structure-schema") {
        //     if definition.get("type").is_some()
        //         && definition.get("type").unwrap().as_str().unwrap() != "zen/map"
        //     {
        //         let inline_type = convert_primitive(definition["type"].as_str().unwrap());
        //
        //         if cache.primitives.get(&resource_name).is_none() {
        //             cache.primitives.insert(
        //                 resource_name.clone(),
        //                 serde_json::to_value(&inline_type).unwrap(),
        //             );
        //         }
        //
        //         return Ok(Some(TypeElement {
        //             name: resource_name.clone(),
        //             element: TypeElementPart {
        //                 description:definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                 sub_type: None,
        //                 source: None,
        //                 extends: None,
        //                 plain_type: Some(inline_type),
        //             },
        //         }));
        //     } else {
        //         let mut result_keys = match definition.get("keys") {
        //             Some(keys) => {
        //                 let type_map = parse_map(
        //                     box_instance,
        //                     cache,
        //                     &resource_name,
        //                     keys,
        //                     definition.get("require"),
        //                 )
        //                 .await?;
        //                 type_map
        //             }
        //             None => {
        //                 let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();
        //
        //                 type_map.insert(
        //                     "[key: string]".to_string(),
        //                     TypeElementSubType {
        //                         description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                         require: Some(false),
        //                         sub_type: None,
        //                         plain_type: Some(String::from("any")),
        //                         extends: None,
        //                         array: None,
        //                     },
        //                 );
        //                 type_map
        //             }
        //         };
        //         if resource_name == "Resource" {
        //             result_keys.insert(
        //                 "resourceType".to_string(),
        //                 TypeElementSubType {
        //                     description: None,
        //                     require: Some(true),
        //                     sub_type: None,
        //                     plain_type: Some("T".to_string()),
        //                     extends: None,
        //                     array: None,
        //                 },
        //             );
        //
        //             return Ok(Some(TypeElement {
        //                 name: String::from("Resource<T>"),
        //                 element: TypeElementPart {
        //                     description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                     sub_type: Some(result_keys),
        //                     source: None,
        //                     extends: None,
        //                     plain_type: None,
        //                 },
        //             }));
        //         } else if resource_name == "DomainResource" {
        //             return Ok(Some(TypeElement {
        //                 name: String::from("DomainResource"),
        //                 element: TypeElementPart {
        //                     description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                     sub_type: Some(result_keys),
        //                     source: None,
        //                     extends: None,
        //                     plain_type: None,
        //                 },
        //             }));
        //         } else {
        //             return Ok(Some(TypeElement {
        //                 name: resource_name.clone(),
        //                 element: TypeElementPart {
        //                     description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                     sub_type: Some(result_keys),
        //                     source: None,
        //                     extends: normalize_confirms(&confirms, &resource_name),
        //                     plain_type: None,
        //                 },
        //             }));
        //         }
        //     }
        // } else {
        //     let result_keys = match definition.get("keys") {
        //         Some(keys) => {
        //             let type_map = parse_map(
        //                 box_instance,
        //                 cache,
        //                 &resource_name,
        //                 keys,
        //                 definition.get("require"),
        //             )
        //             .await?;
        //             type_map
        //         }
        //         None => {
        //             let mut type_map: HashMap<String, TypeElementSubType> = HashMap::new();
        //
        //             type_map.insert(
        //                 "[key: string]".to_string(),
        //                 TypeElementSubType {
        //                     description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //                     require: Some(false),
        //                     sub_type: None,
        //                     plain_type: Some(String::from("any")),
        //                     extends: None,
        //                     array: None,
        //                 },
        //             );
        //             type_map
        //         }
        //     };
        //
        //     return Ok(Some(TypeElement {
        //         name: resource_name.clone(),
        //         element: TypeElementPart {
        //             description: definition
        //                                         .get("zen/desc")
        //                                         .map(|it| it.as_str().unwrap().to_string()),
        //             sub_type: Some(result_keys),
        //             source: Some(!tags.contains(&"zen.fhir/profile-schema")),
        //             extends: normalize_confirms(&confirms, &resource_name),
        //             plain_type: None,
        //         },
        //     }));
        // }
    }
    Ok(None)
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
        ProgressStyle::with_template(
            "{spinner:.green} [{elapsed}] [{bar:40.cyan/red}] ({pos}/{len})",
        )
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

    result
        .iter()
        .for_each(|it| match result_types.get(it.name.as_str()) {
            Some(item) => {
                // info!("yes {:#?}", it.name)
            }
            None => {
                result_types.insert(it.name.to_string(), it.element.clone());
                // info!("yes {:#?}", it)
            }
        });

    match cache.save_intermediate_types(&result_types) {
        Ok(..) | Err(..) => {}
    }

    match cache.save() {
        Ok(..) | Err(..) => {}
    }
    Ok(result_types)
}
