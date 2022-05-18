use crate::types::cache::{Cache, TypeElementPart, TypeElementSubType};
use crate::types::helpers::key_required;
use dprint_plugin_typescript::configuration::*;
use dprint_plugin_typescript::*;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

fn write_nested_type(
  map: HashMap<String, TypeElementSubType>,
  type_name: &str,
  result: &mut Vec<String>,
) {
  for (key, value) in map {
    if value.description.is_some() {
      result.push(format!("/* {} */", value.description.unwrap()));
    }
    if value.plain_type.is_some() {
      if type_name == "CodeableConcept<T = code>"
        && value.plain_type.clone().unwrap().as_str() == "Array<Coding>"
      {
        result.push(format!(
          "{}: Array<Coding<T>>;",
          key_required(key, value.require)
        ));
      } else if type_name == "Coding<T = code>" && key.as_str() == "code" {
        result.push(format!("{}: T;", key_required(key, value.require)));
      } else {
        result.push(format!(
          "{}: {};",
          key_required(key, value.require),
          value.plain_type.unwrap()
        ));
      }
    } else if value.array {
      result.push(format!(
        "{}: Array<{}",
        key_required(key, value.require),
        match value.extends.is_some() {
          true => match value.extends.clone().unwrap().is_empty() {
            true => "{".to_string(),
            false => format!("{} & {{", value.extends.unwrap().join(" & ")),
          },
          false => "{".to_string(),
        }
      ));
      write_nested_type(value.sub_type.unwrap(), type_name, result);
      result.push("}>;".to_string())
    } else if value.extends.is_some() {
      result.push(format!(
        "{}: Array<{}",
        key_required(key, value.require),
        match value.extends.clone().unwrap().is_empty() {
          false => format!("{} & {{", value.extends.unwrap().join(" & ")),
          true => "{".to_string(),
        }
      ));
      write_nested_type(value.sub_type.unwrap(), type_name, result);
      result.push("}>;".to_string())
    } else {
      result.push(format!("{}: {{", key_required(key, value.require)));
      write_nested_type(value.sub_type.unwrap(), type_name, result);
      result.push("};".to_string())
    }
  }
}

pub fn write_types(
  types: HashMap<String, TypeElementPart>,
  cache: Cache,
  fhir: bool,
  output: String,
) {
  let mut result: Vec<String> = vec![];

  if fhir {
    result.push("export type Reference<T extends string> = {\n  reference: `${T}/${string}`;\n  display?: string;\n};\n".to_string());
  } else {
    result.push("export type Reference<T = string> = {\n  id: string;\n  resourceType: T;\n  display?: string;\n};\n".to_string());
  }

  for (key, value) in types {
    let mut name = key;
    if name.starts_with("Rpc") || name.as_str() == "boolean" || name.as_str() == "string" {
      continue;
    }
    if name.as_str() == "CodeableConcept" || name.as_str() == "Coding" {
      name = format!("{}<T = code>", name);
    }
    if value.description.is_some() {
      result.push(format!("/* {} */", value.description.unwrap()));
    }
    if value.plain_type.is_some() {
      result.push(format!(
        "export type {} = {};",
        name.clone(),
        value.plain_type.unwrap()
      ))
    } else if value.sub_type.is_none() && value.plain_type.is_none() {
      if value.extends.clone().is_some()
        && !value.extends.clone().unwrap().len() == 1
        && cache
          .primitives
          .get(value.extends.clone().unwrap().get(0).unwrap())
          .is_some()
      {
        result.push(format!(
          "export type {} = {};",
          name.clone(),
          cache
            .primitives
            .get(value.extends.clone().unwrap().get(0).unwrap())
            .unwrap()
        ))
      } else if value.extends.clone().is_some() {
        result.push(format!(
          "export type {} = {};",
          name.clone(),
          value.extends.unwrap().join(" & ")
        ))
      }
    } else {
      result.push(format!(
        "export type {} = {}",
        name.clone(),
        match value.extends {
          Some(mut it) => {
            it.sort_by_key(|a| a.to_lowercase());
            format!("{} & {{ ", it.join(" & "))
          },
          None => "{ ".to_string(),
        }
      ));
      write_nested_type(value.sub_type.unwrap(), &name, &mut result);

      result.push("};\n".to_string());
    }
  }
  let result_types = result.join("\n");

  let config = ConfigurationBuilder::new()
    .line_width(80)
    .quote_style(QuoteStyle::PreferSingle)
    .build();

  let formatted_result = format_text(&PathBuf::from(output.clone()), &result_types, &config)
    .expect("Could not parse...");
  fs::write(output, formatted_result.as_deref().unwrap_or(&result_types))
    .expect("Expected to write to the file.");
}
