/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ZenSchema } from "./types";
import axios, { AxiosInstance } from "axios";
import fs from "fs";
import { Box, ConceptEntry, ConnectionSource } from "./types";
import { boxLog } from "./logger";

export const createBox = ({ box, client, secret }: ConnectionSource): Box => {
  const instance: AxiosInstance = axios.create({
    baseURL: box,
    auth: {
      username: client,
      password: secret,
    },
  });

  return {
    instance,
    loadAllSymbols: async (
      excludeNamespaces,
      excludedTags,
      cachePath,
      useFromFileSystem,
    ): Promise<string[]> => {
      if (useFromFileSystem) {
        if (fs.existsSync(cachePath + "/aidbox-symbols.json")) {
          try {
            const data: string[] = JSON.parse(
              fs.readFileSync(cachePath + "/aidbox-symbols.json").toString(),
            );
            if (data.length > 0) return data;
            else {
              boxLog("Saved symbols files empty");
            }
          } catch {
            boxLog("Saved symbols files empty");
          }
        } else {
          boxLog("Cached symbols not found. We will load them");
        }
      }
      const {
        data: { result: ns },
      }: { data: { result: string[] } } = await instance.post("/rpc", {
        method: "aidbox.zen/namespaces",
        params: {},
      });

      const namespaces = ns.filter(
        (namespace) =>
          !excludeNamespaces.some((symbol) => symbol.test(namespace)),
      );

      const symbols: string[] = [];

      for (const namespace of namespaces) {
        const {
          data: { result },
        } = await instance.post<{ result: { name: string }[] }>(
          "/rpc",
          `{:method aidbox.zen/symbols :params { :ns ${namespace}}}`,
          { headers: { "Content-Type": "application/edn" } },
        );
        result.map((r: { name: string }) =>
          symbols.push(`${namespace}/${r.name}`),
        );
      }

      const finalResult = symbols.filter(
        (s) => !excludedTags.some((exc) => s.startsWith(exc)),
      );

      fs.writeFileSync(
        cachePath + "/aidbox-symbols.json",
        JSON.stringify(finalResult),
      );

      return finalResult;
    },
    getSymbol: async (symbol) => {
      const {
        data: {
          result: { model: definition },
        },
      } = await instance.post<{ result: { model: ZenSchema } }>(
        "/rpc",
        `{:method aidbox.zen/symbol :params { :name ${symbol}}}`,
        { headers: { "Content-Type": "application/edn" } },
      );
      return definition;
    },
    getConcept: async (symbol) => {
      const {
        data: {
          result: { model: definition },
        },
      } = await instance.post<{ result: { model: ZenSchema } }>(
        "/rpc",
        `{:method aidbox.zen/symbol :params { :name ${symbol}}}`,
        { headers: { "Content-Type": "application/edn" } },
      );
      const {
        data: { entry: concepts },
      } = await instance.get<{ entry: ConceptEntry[] }>(
        `/Concept?valueset=${definition.uri}`,
      );

      return (
        concepts
          ?.map((e: ConceptEntry) => e.resource?.code)
          .filter((item): item is string => !!item) || []
      );
    },
    healthCheck: async () => {
      try {
        const { data } = await instance.get("/__healthcheck");
        return data === "healthy";
      } catch {
        return false;
      }
    },
  };
};
