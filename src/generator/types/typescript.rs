use crate::generator::common::{Element, ElementSchema};
use crate::generator::helpers::key_required;
use dprint_plugin_typescript::configuration::{ConfigurationBuilder, QuoteStyle};
use dprint_plugin_typescript::format_text;
use log::warn;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

fn build_any(value: ElementSchema) -> String {
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  if is_array {
    if is_reference {
      "Array<Reference>".to_string()
    } else {
      "Array<any>".to_string()
    }
  } else if is_reference {
    "Reference".to_string()
  } else {
    "any".to_string()
  }
}

fn build_plain_type(value: ElementSchema) -> String {
  let plain_type = value.plain_type.unwrap();
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  return if is_array {
    if is_reference {
      format!("Array<Reference<'{}'>>", plain_type)
    } else {
      format!("Array<{}>", plain_type)
    }
  } else if is_reference {
    format!("Reference<'{}'>", plain_type)
  } else {
    plain_type
  };
}

fn build_values(value: ElementSchema) -> String {
  let values = value
    .values
    .unwrap()
    .iter()
    .map(|it| format!("\"{}\"", it))
    .collect::<Vec<_>>()
    .join(" | ");
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  return if is_array {
    if is_reference {
      format!("Array<Reference<{}>>", values)
    } else {
      format!("Array<{}>", values)
    }
  } else if is_reference {
    format!("Reference<{}>", values)
  } else {
    values
  };
}

fn typescript_write_nested_type(map: HashMap<String, ElementSchema>, result: &mut Vec<String>) {
  for (key, value) in map {
    if value.description.is_some() {
      result.push(format!("/* {} */", value.description.as_ref().unwrap()));
    }
    if key == "__" {
      result.push("[key: string]: any;".to_string());
    } else if value.plain_type.is_none() && value.sub_type.is_none() {
      if value.extends.is_some() {
        let target_extends = value.extends.unwrap();
        if !target_extends.is_empty() {
          result.push(format!(
            "{}: {};",
            key_required(key, value.require),
            target_extends.join(" & ")
          ))
        } else {
          result.push(format!("{}: any;", key_required(key, value.require)))
        }
      } else if value.values.is_some() {
        result.push(format!(
          "{}: {};",
          key_required(key, value.require),
          build_values(value)
        ));
      } else {
        result.push(format!(
          "{}: {};",
          key_required(key, value.require),
          build_any(value)
        ));
      }
    } else if value.plain_type.is_some() {
      result.push(format!(
        "{}: {} {};",
        key_required(key, value.require),
        match value.extends.clone() {
          Some(mut it) => {
            it.sort_by_key(|a| a.to_lowercase());
            if it.is_empty() {
              "".to_string()
            } else {
              format!("{} & {{ ", it.join(" & "))
            }
          },
          None => "".to_string(),
        },
        build_plain_type(value)
      ));
    } else {
      result.push(format!("{}: {{", key_required(key, value.require)));
      typescript_write_nested_type(value.sub_type.unwrap(), result);
      result.push("};".to_string())
    }
  }
}

fn write_rpc(name: String, definition: Element, result: &mut Vec<String>) {
  result.push(format!("export type {} = {{", name));
  result.push(format!(
    "method: {};",
    format_args!("\"{}\"", definition.rpc_method.unwrap())
  ));
  result.push("params: {".to_string());

  if definition.schema.is_some() {
    typescript_write_nested_type(definition.schema.unwrap(), result);
  }
  result.push("}".to_string());
  result.push("}".to_string());
}

pub fn write_typescript_types(types: HashMap<String, Element>, fhir: bool, output: String) {
  let mut result: Vec<String> = vec![];
  let mut resource_map: Vec<String> = vec![];

  if fhir {
    result.push("export type Reference<T extends string> = {\n  reference: `${T}/${string}`;\n  display?: string;\n identifier: Identifier[];\n};\n".to_string());
  } else {
    result.push("export type Reference<T = string> = {\n  id: string;\n  resourceType: T;\n  display?: string;\n identifier: Identifier[];\n};\n".to_string());
  }

  for (key, value) in types {
    let mut name = key;
    if name.as_str() == "boolean" || name.as_str() == "string" {
      continue;
    }

    if name.as_str() == "CodeableConcept" || name.as_str() == "Coding" {
      name = format!("{}<T = code>", name);
    }

    if let Some(ext) = value.extends.clone() {
      if !ext.is_empty() {
        for ex in ext {
          if ex.starts_with("Resource") {
            resource_map.push(name.clone());
          }
        }
      }
    }

    if value.description.is_some() {
      result.push(format!("/* {} */", value.description.as_ref().unwrap()));
    }

    if value.is_rpc {
      write_rpc(name, value, &mut result);
    } else if value.plain.is_some() {
      result.push(format!(
        "export type {} = {};",
        name.clone(),
        value.plain.unwrap()
      ))
    } else if value.schema.is_none() && value.plain.is_none() {
      if value.values.is_some() {
        result.push(format!(
          "export type {} = {};",
          name.clone(),
          value
            .values
            .unwrap()
            .iter()
            .map(|it| format!("\"{}\"", it))
            .collect::<Vec<_>>()
            .join(" | ")
        ))
      } else if value.extends.is_some() {
        let target_extends = value.extends.unwrap();
        if !target_extends.is_empty() {
          result.push(format!(
            "export type {} = {};",
            name.clone(),
            target_extends.join(" & ")
          ))
        } else {
          result.push(format!("export type {} = any;", name.clone()))
        }
      } else {
        result.push(format!("export type {} = any;", name.clone()))
      }
    } else {
      result.push(format!(
        "export interface {} {}",
        name.clone(),
        match value.extends {
          Some(mut it) => {
            it.sort_by_key(|a| a.to_lowercase());
            format!("extends {} {{ ", it.join(" , "))
          },
          None => "{ ".to_string(),
        }
      ));
      typescript_write_nested_type(value.schema.unwrap(), &mut result);

      result.push("};\n".to_string());
    }
  }

  result.push("export type EntityList = {".to_string());

  for resource in resource_map {
    result.push(format!("{}:{}", resource.clone(), resource))
  }

  result.push("};\n".to_string());

  result.push("export type EntityType = keyof EntityList;".to_string());
  result.push("export type Entity<T extends EntityType | void = void> = T extends EntityType ? EntityList[T] : EntityList;".to_string());

  let result_types = result.join("\n");
  let config = ConfigurationBuilder::new()
    .line_width(120)
    .quote_style(QuoteStyle::PreferSingle)
    .build();

  match format_text(&PathBuf::from(output.clone()), &result_types, &config) {
    Ok(formatted) => {
      fs::write(output, formatted.as_deref().unwrap_or(&result_types))
        .expect("Expected to write to the file.");
    },
    Err(_) => {
      warn!("Cannot apply format for result file. Raw result will be saved");
      fs::write(output, result_types).expect("Write result to file error");
    },
  }
}
