import { CLIGenerateTypes } from "./types";
import { cliLog } from "./logger";
import fs from "fs";
import path from "path";
import { createBox } from "./box";
import { createCache } from "./cache";
import { writer } from "./writer";
import { generateTypes } from "./reader";

export const clearCache = (cachePath: string) => {
  const resolvedPath = path.resolve(cachePath);
  if (fs.existsSync(resolvedPath)) {
    cliLog("Clear cache started...");

    fs.rmSync(resolvedPath, { recursive: true });

    cliLog("Clear cache finished");
  } else {
    cliLog("Provided path - %s doesn't exist", resolvedPath);
  }
};

export const generate = async (params: CLIGenerateTypes) => {
  cliLog("Create box client...");
  const box = createBox({
    box: params.box,
    client: params.client,
    secret: params.secret,
  });

  const isReady = await box.healthCheck();
  if (!isReady) {
    throw Error("[Box] Not ready to use");
  }

  cliLog("Create cache client...");
  const cache = createCache(
    params.cache,
    params.cachePath
      ? path.resolve(params.cachePath)
      : `${process.cwd()}/.local-cache`,
  );
  cliLog("Start...");

  const resultTypes = await generateTypes(box, cache);

  cliLog("Write type on disk...");

  writer(resultTypes, cache, params.fhirReference, path.resolve(params.output));
  cliLog("Finish...");
};
