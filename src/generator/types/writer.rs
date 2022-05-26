use crate::generator::cache::Cache;
use crate::generator::common::{Element, ElementSchema};
use crate::generator::helpers::key_required;
use dprint_plugin_typescript::configuration::*;
use dprint_plugin_typescript::*;
use log::error;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

fn build_any(value: ElementSchema) -> String {
  if value.extends.is_some() {
    println!("in any type {:#?}", value);
  }
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  return if is_array {
    if is_reference {
      format!("Array<Reference>")
    } else {
      format!("Array<any>")
    }
  } else if is_reference {
    format!("Reference")
  } else {
    "any".to_string()
  };
}

fn build_plain_type(value: ElementSchema) -> String {
  if value.extends.is_some() {
    println!("in plain type {:#?}", value);
  }
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
  if value.extends.is_some() {
    println!("In values {:#?}", value);
  }
  let values = value.values.unwrap();
  let is_reference = value.is_reference;
  let is_array = value.is_array;

  return if is_array {
    if is_reference {
      format!(
        "Array<Reference<{}>>",
        values
          .iter()
          .map(|it| format!("'{}'", it))
          .collect::<Vec<_>>()
          .join(" | ")
      )
    } else {
      format!("Array<{}>", values.join(" | "))
    }
  } else if is_reference {
    format!(
      "Reference<{}>",
      values
        .iter()
        .map(|it| format!("'{}'", it))
        .collect::<Vec<_>>()
        .join(" | ")
    )
  } else {
    values.join(" | ")
  };
}

fn typescript_write_nested_type(
  map: HashMap<String, ElementSchema>,
  type_name: &str,
  result: &mut Vec<String>,
) {
  for (key, value) in map {
    if value.description.is_some() {
      result.push(format!("/* {} */", value.clone().description.unwrap()));
    }
    if value.values.is_some() {
      result.push(format!(
        "{}: {};",
        key_required(key, value.require),
        build_values(value)
      ));
    } else if value.plain_type.is_some() {
      result.push(format!(
        "{}: {};",
        key_required(key, value.require),
        build_plain_type(value)
      ));
    } else if value.sub_type.is_none() & value.plain_type.is_none() & value.values.is_none() {
      result.push(format!(
        "{}: {};",
        key_required(key, value.require),
        build_any(value)
      ));
    } else {
      if (value.sub_type.is_none()) {
        println!("{:#?}", value);
      }
      result.push(format!("{}: {{", key_required(key, value.require)));
      typescript_write_nested_type(value.sub_type.unwrap(), type_name, result);
      result.push("};".to_string())
    }
  }
}

fn write_typescript_types(
  types: HashMap<String, Element>,
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
    if value.plain.is_some() {
      result.push(format!(
        "export type {} = {};",
        name.clone(),
        value.plain.unwrap()
      ))
    } else if value.schema.is_none() && value.plain.is_none() {
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
      typescript_write_nested_type(value.schema.unwrap(), &name, &mut result);

      result.push("};\n".to_string());
    }
  }
  let result_types = result.join("\n");
  let config = ConfigurationBuilder::new()
    .line_width(120)
    .quote_style(QuoteStyle::PreferSingle)
    .build();

  let formatted_result = format_text(&PathBuf::from(output.clone()), &result_types, &config)
    .expect("Could not parse...");
  fs::write(output, formatted_result.as_deref().unwrap_or(&result_types))
    .expect("Expected to write to the file.");
}

pub fn write_types(
  types: HashMap<String, Element>,
  cache: Cache,
  fhir: bool,
  output: String,
  target: &str,
) {
  match target {
    "typescript" => write_typescript_types(types, cache, fhir, output),
    _ => {
      error!("Unknown target");
      std::process::exit(0);
    },
  }
}
