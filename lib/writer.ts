import fs from "fs";
import { Cache, Types } from "./types";
import { keyRequired } from "./helpers";
import prettier from "prettier";

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
  let types: string;
  if (fhirReference) {
    types =
      "export type Reference<T extends string> = {\n  reference: `${T}/${string}`;\n  display?: string;\n};\n\n";
  } else {
    types =
      "export type Reference<T = string> = {\n  id: string;\n  resourceType: T;\n  display?: string;\n};\n\n";
  }
  //eslint-disable-next-line
  for (let [name, element] of Object.entries(schema)) {
    if (name.startsWith("Rpc") || name === "boolean" || name === "string") {
      continue;
    }
    if (name === "CodeableConcept" || name === "Coding") {
      name = `${name}<T = code>`;
    }

    if (element.desc) {
      types += `/* ${element.desc} */\n`;
    }
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
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
  fs.writeFileSync(output, prettier.format(types, { parser: "typescript" }));
};
