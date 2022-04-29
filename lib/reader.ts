import {
  Box,
  Cache,
  Types,
  TypesElement,
  TypesElementPart,
  ZenSchema,
  ZenSchemaKeys,
} from "./types";
import {
  capitalize,
  convertPrimitive,
  zenPathToName,
  normalizeConfirms,
  wrapKey,
} from "./helpers";
import { readerLog } from "./logger";
import merge from "./merge";
import * as cliProgress from "cli-progress";

//
const excludeNamespaces = [
  /^aidbox/,
  /^zenbox.api/,
  /^fhir/,
  /^zen$/,
  /zenbox/,
  /zen.fhir/,
  /relatient.base/,
];

const excludedTags = [
  "hl7-fhir-r4-core.search.",
  "hl7-fhir-r4-core.value-set.",
  "hl7-fhir-us-core.value-set.",
  "hl7-fhir-us-core.search.",
];

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

export const parseMap = async (
  box: Box,
  cache: Cache,
  resourceName: string,
  keys: Exclude<ZenSchema["keys"], undefined> = {},
  require: string[] = [],
): Promise<Record<string, TypesElementPart>> => {
  const result: Array<[string, TypesElementPart]> = [];

  for (const [key, value] of Object.entries(keys)) {
    if (value["zen.fhir/value-set"]) {
      const values = await getValueset(
        box,
        cache,
        value["zen.fhir/value-set"].symbol,
      );
      result.push([
        wrapKey(key),
        {
          require: require.includes(key),
          type:
            values.map((v: string) => `"${v}"`).join(" | ") ||
            (
              await getConfirms(box, cache, value["confirms"], resourceName)
            ).join(" | ") ||
            "'any'",
          desc: value["zen/desc"],
        },
      ]);
    } else if (value.type) {
      if (value.type === "zen/boolean") {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: "boolean",
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/number") {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: "number",
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/datetime") {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: "dateTime",
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/integer") {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: "integer",
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/string") {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: value?.enum
              ? value.enum.map((e) => `"${e.value}"`).join(" | ")
              : "string",
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/vector") {
        const type = await parseVector(box, cache, resourceName, value.every);
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            ...(typeof type === "string"
              ? { type: `Array<${type}>` }
              : { array: true, type: type }),
            desc: value["zen/desc"],
          },
        ]);
      } else if (value.type === "zen/map") {
        if (value["validation-type"] === "open") {
          result.push([
            wrapKey(key),
            {
              require: require.includes(key),
              type: `any`,
              desc: value["zen/desc"],
            },
          ]);
        } else if (value["confirms"]) {
          const baseTypes = await getConfirms(
            box,
            cache,
            value.confirms,
            resourceName,
          );
          if (value["validation-type"] === "open") {
            result.push([
              wrapKey(key),
              {
                require: require.includes(key),
                type: `${baseTypes.join(" & ")} & {[key:string]: unknown}`,
                desc: value["zen/desc"],
              },
            ]);
          } else if (value?.keys) {
            result.push([
              wrapKey(key),
              {
                require: require.includes(key),
                extends: baseTypes,
                type: await parseMap(
                  box,
                  cache,
                  resourceName,
                  value.keys,
                  value.require,
                ),
                desc: value["zen/desc"],
              },
            ]);
          } else {
            result.push([
              wrapKey(key),
              {
                require: require.includes(key),
                type: "any",
                desc: value["zen/desc"],
              },
            ]);
          }
        } else if (value?.keys) {
          result.push([
            wrapKey(key),
            {
              require: require.includes(key),
              type: await parseMap(
                box,
                cache,
                resourceName,
                value["keys"],
                value["require"],
              ),
              desc: value["zen/desc"],
            },
          ]);
        } else if (value?.values?.type === "zen/any") {
          result.push([
            wrapKey(key),
            {
              require: require.includes(key),
              type: `Record<string,any>`,
              desc: value["zen/desc"],
            },
          ]);
        } else if (value?.values?.keys) {
          result.push([
            wrapKey(key),
            {
              require: require.includes(key),
              type: await parseMap(
                box,
                cache,
                resourceName,
                value.values.keys,
                value.values?.require,
              ),
              desc: value["zen/desc"],
            },
          ]);
        } else {
          console.log("map", value);
          result.push([
            wrapKey(key),
            {
              require: require.includes(key),
              type: '"map-any"',
              desc: value["zen/desc"],
            },
          ]);
        }
      } else {
        console.log("type exist", key, value);
        process.exit(1);
      }
    } else if (!value["type"] && value["confirms"]) {
      if (value["zen.fhir/reference"]?.refers) {
        const refers = await getConfirms(
          box,
          cache,
          value["zen.fhir/reference"]?.refers,
          resourceName,
        );
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type: refers?.length
              ? `Reference<'${refers.join("' | '")}'>`
              : `Reference`,
            desc: value["zen/desc"],
          },
        ]);
      } else {
        result.push([
          wrapKey(key),
          {
            require: require.includes(key),
            type:
              (
                await getConfirms(box, cache, value["confirms"], resourceName)
              ).join(" | ") || "'confirms-any'",
            desc: value["zen/desc"],
          },
        ]);
      }
    } else if (!value["type"]) {
      result.push([
        wrapKey(key),
        {
          require: require.includes(key),
          type: "any",
          desc: value["zen/desc"],
        },
      ]);
    } else {
      console.log("wtf", key, value);
      process.exit(1);
    }
  }
  return Object.fromEntries(result);
};

export const parseRpcSchema = (
  box: Box,
  cache: Cache,
  symbol: string,
  definition: ZenSchema,
) => {
  const [namespace, name] = symbol.split("/");
  // const paramsType = definition.params?.type;
  const rpcName = `Rpc${capitalize(namespace.split(".").reverse()[0])}${name
    .split("-")
    .map((n) => capitalize(n))
    .join("")}`;
  return {
    description: definition["zen/desc"] || null,
    name: rpcName,
    def: {
      method: symbol,
      params: "parse-rpc",
    },
  };
};

const getSymbol = async (
  box: Box,
  cache: Cache,
  symbol: string,
): Promise<ZenSchema> => {
  const exist = cache.schema.get(symbol);
  if (exist) {
    return exist;
  }
  const definition = await box.getSymbol(symbol);
  cache.schema.set(symbol, definition);
  return definition;
};

const getConfirms = async (
  box: Box,
  cache: Cache,
  confirms: string[] = [],
  resourceName: string,
): Promise<string[]> => {
  const result = new Set<string>();
  for (const confirm of confirms) {
    const exist = cache.confirms.get(confirm);
    if (exist) {
      result.add(exist);
    } else {
      let el = cache.schema.get(confirm);
      if (!el) {
        const definition = await box.getSymbol(confirm);
        cache.schema.set(confirm, definition);
        el = definition;
      }
      if (el["fhir/polymorphic"]) {
        // readerLog("polymorhic element", confirm);
      } else {
        const name = getName(el, `any-${confirm}`);
        const newName = name.includes("-")
          ? name.split("-").map(capitalize).join("")
          : name;
        cache.confirms.set(confirm, newName);
        result.add(newName);
      }
    }
  }
  return [...result].map((r) =>
    r === "Resource" ? `Resource<'${resourceName}'>` : r,
  );
};

const getName = (element: ZenSchema, otherwise = ""): string => {
  if (element["zen.fhir/type"]) {
    return element["zen.fhir/type"];
  }

  if (element["resourceType"]) {
    return element["resourceType"];
  }

  const name = zenPathToName(element["zen/name"]);
  if (name) {
    return name;
  }

  return otherwise;
};

const getValueset = async (
  box: Box,
  cache: Cache,
  symbol: string,
): Promise<string[]> => {
  const exist = cache.valueSets.get(symbol);
  if (exist) {
    return exist;
  } else {
    const definition = await box.getConcept(symbol);
    cache.valueSets.set(symbol, definition);
    return definition;
  }
};
export const parseSymbol = async (
  box: Box,
  cache: Cache,
  symbol: string,
  includeProfile: boolean,
): Promise<TypesElement | undefined> => {
  const definition = await getSymbol(box, cache, symbol);

  if (
    definition["zen/tags"].includes("zen.fhir/profile-schema") &&
    !includeProfile
  ) {
    return;
  }

  if (definition["zen/tags"].includes("zen.fhir/search")) {
    return;
  }

  if (definition["zen/tags"]?.includes("zenbox/rpc")) {
    return;
    // return await parseRpcSchema(box, cache, symbol, definition);
  }
  const name = getName(definition);

  if (name === "Reference") {
    return;
  }

  const confirms = await getConfirms(box, cache, definition.confirms, name);

  if (
    definition["zen/tags"].length === 1 &&
    definition["zen/tags"][0] === "zen/schema"
  ) {
    if (!definition["confirms"]?.includes("zenbox/Resource")) {
      const subName = zenPathToName(symbol);
      const subConfirms = await getConfirms(
        box,
        cache,
        definition.confirms,
        name,
      );

      if (!definition.keys) {
        console.log(symbol, definition);
        cache.save();
        process.exit(1);
      }
      const parsedTypes = definition.keys
        ? await parseMap(box, cache, name, definition.keys, definition.require)
        : ({
            "[key:string]": { type: "any", require: true },
          } as TypesElementPart["defs"]);

      return {
        name: subName,
        desc: definition["zen/desc"],
        defs: parsedTypes,
        ...normalizeConfirms(subConfirms, name),
      };
    } else {
      readerLog("Unknown simple schema %s - %O", symbol, definition);
    }
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
      const newName = zenPathToName(definition["zen/name"]) || "";

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
          const newName = zenPathToName(definition["zen/name"]);

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
export const generateTypes = async (
  box: Box,
  cache: Cache,
  includeProfile: boolean,
): Promise<Types> => {
  readerLog("Start load symbols...");
  const symbols = await box.loadAllSymbols(
    excludeNamespaces,
    excludedTags,
    cache.cachePath,
    true,
  );

  const result = [];

  const progress = new cliProgress.SingleBar(
    { hideCursor: true, etaAsynchronousUpdate: true },
    cliProgress.Presets.shades_grey,
  );

  readerLog("Start process symbols...");
  progress.start(symbols.length, 0);

  for (const [idx, symbol] of Object.entries(symbols)) {
    const definition = await parseSymbol(box, cache, symbol, includeProfile);

    if (definition) {
      result.push(definition);
    }
    progress.update(Number(idx) + 1);
  }

  progress.stop();

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
  cache.saveIntermediateTypes(finalResult);
  cache.save();
  return finalResult;
};
