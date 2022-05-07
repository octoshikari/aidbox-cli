use crate::types::cache::{Cache, TypeElementPart};
use log::{error, info};
use std::collections::HashMap;
use std::fs;

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
        info!("{:#?}", name);
    }

    match fs::write(output, result.join("\n")) {
        Ok(..) => info!("Types was saved on filesystem!"),
        Err(err) => error!("{:#?}", err),
    }
}

/*

export const writeNestedType = (defs: Types = {}, typeName: string) => {
  let type = "";
  for (const [key, value] of Object.entries(defs)) {
    if (value.desc) {
      type += `/* ${value.desc} */\n`;
    }
    if (typeof value.type === "string") {
      if (
        typeName === `CodeableConcept<T = code>` &&
        value.type === "Array<Coding>"
      ) {
        type += `${key}: Array<Coding<T>>;\n`;
      } else if (typeName === `Coding<T = code>` && key === "code") {
        type += `${keyRequired(key, value.require)}: T;\n`;
      } else {
        type += `${keyRequired(key, value.require)}: ${value.type};\n`;
      }
    } else if (value?.array) {
      type += `${keyRequired(key, value.require)}: Array<${
        value?.extends ? value.extends.join(" & ") + " & " : ""
      } {\n${writeNestedType(value.type, typeName)}}>;\n`;
    } else if (value?.extends) {
      type += `${keyRequired(key, value.require)}: ${
        value.extends.join(" & ") + " & "
      } {\n${writeNestedType(value.type, typeName)}};\n`;
    } else {
      type += `${keyRequired(key, value.require)}: {\n`;
      type += `${writeNestedType(value.type, typeName)}`;
      type += `}\n`;
    }
  }
  return type;
};

export const writer = (
  schema: Types,
  cache: Cache,
  fhirReference = false,
  output: string,
) => {
  for (let [name, element] of Object.entries(schema)) {


    if (element.type && typeof element.type === "string") {
      types += `export type ${name} = ${element.type};\n`;
    } else if (!element.defs && !element.type) {
      if (
        element.extends?.length === 1 &&
        cache.primitives.get(element.extends[0])
      ) {
        const fromCache = cache.primitives.get(element.extends[0]);
        if (fromCache) {
          types += `export type ${name} = ${fromCache}\n`;
        }
      } else if (element.extends) {
        types += `export type ${name} = ${element.extends.join(" & ")};\n`;
      }
    } else {
      types += `export type ${name} = ${
        (typeof element.extends === "string" && element.extends !== "") ||
        (element.extends && element.extends?.length > 0)
          ? element.extends.join(" & ") + " & "
          : ""
      }{\n`;
      types += writeNestedType(element.defs, name);
      types += `}\n\n`;
    }
  }
  writerLog("Write file by path %s", output);
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
  fs.writeFileSync(output, prettier.format(types, { parser: "typescript" }));
};

*/
