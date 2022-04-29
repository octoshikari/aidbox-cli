/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from "fs";
import { Cache, ZenSchema } from "./types";
import { cacheLog } from "./logger";

const prepareItem = <T>(
  enable: boolean,
  path: string,
  item: string,
): Map<string, T> => {
  if (enable && fs.existsSync(path + "/" + item + ".json")) {
    const data: Record<string, T> = JSON.parse(
      fs.readFileSync(path + "/" + item + ".json").toString(),
    );
    return new Map(Object.entries(data));
  } else {
    return new Map();
  }
};

export const createCache = (
  storeInFiles = false,
  cachePath = `${process.cwd()}/.cache`,
): Cache => {
  const confirms = prepareItem<string>(storeInFiles, cachePath, "confirms");
  const schema = prepareItem<ZenSchema>(storeInFiles, cachePath, "schema");
  const primitives = prepareItem<string>(storeInFiles, cachePath, "primitives");
  const valueSets = prepareItem<string[]>(storeInFiles, cachePath, "valueSets");

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  return {
    confirms,
    schema,
    valueSets,
    cachePath,
    primitives,
    clearFolder: () =>
      fs.existsSync(cachePath) && fs.rmSync(cachePath, { recursive: true }),
    saveIntermediateTypes: (types) => {
      cacheLog("Save intermediate types into file");
      fs.writeFileSync(cachePath + "/types.json", JSON.stringify(types));
    },
    save: () => {
      cacheLog("Start save cache...");
      if (storeInFiles) {
        cacheLog("Save in files");

        fs.writeFileSync(
          cachePath + "/confirms.json",
          JSON.stringify(Object.fromEntries(confirms.entries())),
        );
        fs.writeFileSync(
          cachePath + "/schema.json",
          JSON.stringify(Object.fromEntries(schema.entries())),
        );

        fs.writeFileSync(
          cachePath + "/primitives.json",
          JSON.stringify(Object.fromEntries(primitives.entries())),
        );

        fs.writeFileSync(
          cachePath + "/valuesets.json",
          JSON.stringify(Object.fromEntries(valueSets.entries())),
        );
        cacheLog("Save cache finished");
      } else {
        cacheLog("Save cache in files disabled");
      }
    },
  };
};
