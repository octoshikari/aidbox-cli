#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { clearCache, generate } from "../lib/cli";

(async () =>
  await yargs(hideBin(process.argv))
    .usage(`Usage: $0 <command> [options]`)
    .command(
      "clear-cache",
      "Clear cache folder",
      (yargs) => {
        return yargs.option("path", {
          alias: "p",
          type: "string",
          demandOption: true,
          description: "Cache folder path",
        });
      },
      (argv) => {
        clearCache(argv.path);
      },
    )
    .command(
      "generate",
      "Generate types",
      (yargs) => {
        return yargs
          .option("box", {
            alias: "b",
            type: "string",
            demandOption: true,
            description: "Aidbox URL",
          })
          .option("client", {
            alias: "c",
            type: "string",
            demandOption: true,
            description: "Aidbox client",
          })
          .option("secret", {
            alias: "s",
            type: "string",
            demandOption: true,
            description: "Aidbox secret",
          })
          .option("cachePath", {
            type: "string",
            description: "Cache folder path",
          })
          .option("cache", {
            type: "boolean",
            default: false,
            description: "Use cache",
          })
          .option("fhirReference", {
            type: "boolean",
            default: false,
            description: "Use fhir reference type",
          })
          .option("includeProfile", {
            alias: "p",
            type: "boolean",
            default: false,
            description: "Include all profiles into result types",
          })
          .option("output", {
            alias: "o",
            type: "string",
            default: "aidbox-generated-types.ts",
            description: "Output file with types",
          });
      },
      (argv) => {
        generate(argv).catch((e) => console.log("Type generate error", e));
      },
    )
    .parse())().catch((e) => console.log("cli error", e));
