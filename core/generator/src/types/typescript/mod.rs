use crate::common::{Element, ElementSchema};
use crate::helpers::key_required;
use dprint_plugin_typescript::configuration::{ConfigurationBuilder, QuoteStyle};
use dprint_plugin_typescript::format_text;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Clone)]
pub struct WriterConfig {
  pub fhir: bool,
  pub output: String,
  pub collapse_values: bool,
  pub max_values: usize,
}

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

  if is_array {
    if is_reference {
      if plain_type != "Reference" {
        format!("Array<Reference<'{}'>>", plain_type)
      } else {
        "Array<Reference>".to_string()
      }
    } else {
      format!("Array<{}>", plain_type)
    }
  } else if is_reference {
    if plain_type != "Reference" {
      format!("Reference<'{}'>", plain_type)
    } else {
      "Reference".to_string()
    }
  } else {
    plain_type
  }
}

fn build_values(value: ElementSchema, config: WriterConfig) -> String {
  let binding = value.values.unwrap();
  let values = binding.iter().map(|it| format!("\"{}\"", it));
  let total = values.clone().count();
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  if is_array {
    if is_reference {
      format!("Array<Reference<{}>>", values.collect::<Vec<_>>().join("|"))
    } else if config.collapse_values && total > config.max_values {
      "Array<string>".to_string()
    } else {
      format!("Array<{}>", values.collect::<Vec<_>>().join("|"))
    }
  } else if is_reference {
    format!("Reference<{}>", values.collect::<Vec<_>>().join("|"))
  } else if config.collapse_values && total > config.max_values {
    "string".to_string()
  } else {
    values.collect::<Vec<_>>().join("|")
  }
}

fn typescript_write_nested_type(
  map: HashMap<String, ElementSchema>,
  result: &mut Vec<String>,
  input_config: WriterConfig,
) {
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
          build_values(value, input_config.clone())
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
      typescript_write_nested_type(value.sub_type.unwrap(), result, input_config.clone());
      if value.is_array {
        result.push("}[];".to_string())
      } else {
        result.push("};".to_string())
      }
    }
  }
}

fn write_rpc(
  name: String,
  definition: Element,
  result: &mut Vec<String>,
  input_config: WriterConfig,
) {
  result.push(format!("export type {} = {{", name));
  result.push(format!(
    "method: {};",
    format_args!("\"{}\"", definition.rpc_method.unwrap())
  ));
  if definition.schema.is_some() {
    result.push("params: {".to_string());
    typescript_write_nested_type(definition.schema.unwrap(), result, input_config);
    result.push("}".to_string());
  }
  result.push("}\n".to_string());
}

pub fn write_typescript_types(types: HashMap<String, Element>, input_config: WriterConfig) {
  let mut result: Vec<String> = vec![];
  let mut resource_map: Vec<String> = vec![];

  if input_config.fhir {
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
      write_rpc(name, value, &mut result, input_config.clone());
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
      typescript_write_nested_type(value.schema.unwrap(), &mut result, input_config.clone());

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

  match format_text(
    &PathBuf::from(input_config.output.clone()),
    &result_types,
    &config,
  ) {
    Ok(formatted) => {
      fs::write(
        input_config.output,
        formatted.as_deref().unwrap_or(&result_types),
      )
      .expect("Expected to write to the file.");
    },
    Err(_) => {
      fs::write(input_config.output, result_types).expect("Write result to file error");
    },
  }
}
