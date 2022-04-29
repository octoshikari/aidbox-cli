import { TypeScriptPrimitive } from "./types";

export const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const kebabToCamel = (str: string): string =>
  str
    .replaceAll(/-(\w)/g, (_, c: string) => c.toUpperCase())
    .replaceAll("-", "");

export const zenPathToName = (str: string): string => {
  const [nsName, symbolName] = str.split("/");
  if (symbolName !== "schema") {
    return kebabToCamel(symbolName);
  }

  if (nsName) {
    const nsParts = nsName.split(".");
    const nsLastPart = nsParts[nsParts.length - 1];
    return kebabToCamel(nsLastPart);
  } else {
    return "unknown-name";
  }
};

export const wrapKey = (key: string) =>
  key.includes("-") && !key.startsWith("'") && !key.endsWith("'")
    ? `'${key}'`
    : key;

export const normalizeConfirms = (confirms: string[], name: string) => {
  if (!Array.isArray(confirms) || !name) {
    return {};
  } else if (confirms.length === 0) {
    return {};
  } else if (confirms.length === 1 && confirms[0] === name) {
    return {};
  } else {
    const cleared = confirms.filter((c) => c !== name);
    return confirms.length === 0 ? {} : { extends: cleared };
  }
};

export const keyRequired = (key: string, require = false) =>
  require ? key : `${key}?`;

export function convertPrimitive(val: "zen/string"): "string";
export function convertPrimitive(val: "zen/boolean"): "boolean";
export function convertPrimitive(val: "zen/date"): "string";
export function convertPrimitive(val: "zen/datetime"): "string";
export function convertPrimitive(val: "zen/number"): "number";
export function convertPrimitive(val: "zen/integer"): "number";
export function convertPrimitive(val: string): TypeScriptPrimitive;
export function convertPrimitive(val: string): TypeScriptPrimitive {
  switch (val) {
    case "zen/string":
      return "string";
    case "zen/boolean":
      return "boolean";
    case "zen/date":
      return "string";
    case "zen/datetime":
      return "string";
    case "zen/number":
      return "number";
    case "zen/integer":
      return "number";
    default:
      console.error("Unknown primitive type", val);
      return `any`;
  }
}
