use crate::types::cache::{Cache, TypeElement, TypeElementPart};
use crate::types::r#box::BoxInstance;
use indicatif::{ProgressBar, ProgressStyle};
use log::info;
use serde_json::Value;
use std::collections::HashMap;
use std::error::Error;

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
        let definition = box_instance.get_symbol(&symbol).await?;
        cache
            .schema
            .insert(symbol.clone().to_string(), definition.clone());
        Ok(definition)
    };
}

/// Get value set from cache or retrieve by Aidbox API and store in cache
async fn get_value_set(
    box_instance: &BoxInstance,
    cache: &mut Cache,
    symbol: &String,
) -> Result<Vec<String>, Box<dyn Error>> {
    let exist = cache.value_sets.get(symbol);
    return if exist.is_some() {
        Ok(exist.unwrap().to_owned())
    } else {
        let definition = box_instance.get_concept(&symbol).await?;
        cache
            .value_sets
            .insert(symbol.clone().to_string(), definition.clone());
        Ok(definition)
    };
}

fn get_name() -> String {
    return "".to_string();
}

/*

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

 */

async fn parse_symbol(
    box_instance: &BoxInstance,
    cache: &mut Cache,
    symbol: &String,
    include_profiles: bool,
) -> Result<Option<()>, Box<dyn Error>> {
    let definition = get_symbol(box_instance, cache, symbol).await?;
    if definition.get("zen/tags").is_some() {
        let tags: Vec<_> = definition
            .get("zen/tags")
            .unwrap()
            .as_array()
            .unwrap()
            .iter()
            .map(|item| item.as_str())
            .filter(|item| item.is_some())
            .map(|item| item.unwrap())
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

        return Ok(Some(()));
    }

    return Ok(None);
}

/*
export const parseSymbol = async (
  box: Box,
  cache: Cache,
  symbol: string,
  includeProfile: boolean,
): Promise<TypesElement | undefined> => {


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
            result.push(definition)
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
            },
        },
    );

    match cache.save_intermediate_types(&types) {
        _ => {}
    }

    match cache.save() {
        _ => {}
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
