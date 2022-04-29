import { suite } from "uvu";
import assert from "uvu/assert";
import MockAdapter from "axios-mock-adapter";
import { createBox } from "../lib/box";
import fs from "fs";
import { createCache } from "../lib/cache";

const boxSuite = suite("Box");
const box = createBox({
  box: "http://localhost:8091",
  client: "root",
  secret: "secret",
});

const mock = new MockAdapter(box.instance);

boxSuite("init", async () => {
  mock.onGet("/__healthcheck").timeout();
  assert.is(await box.healthCheck(), false);

  mock.onGet("/__healthcheck").reply(200, "healthy");
  assert.is(await box.healthCheck(), true);

  mock.reset();
});

boxSuite("[loadAllSymbols] cache don't exist", async () => {
  mock
    .onPost("/rpc", {
      method: "aidbox.zen/namespaces",
      params: {},
    })
    .reply(200, { result: ["test"] })
    .onPost("/rpc", `{:method aidbox.zen/symbols :params { :ns test}}`)
    .reply(200, { result: [{ name: "test-symbol" }] });

  const cache = createCache(false, `${process.cwd()}/.test-cache`);
  const result = await box.loadAllSymbols([], [], cache.cachePath, false);

  assert.equal(result, ["test/test-symbol"]);

  mock.reset();
});

boxSuite("[loadAllSymbols] use cache, but cache don't exist", async () => {
  mock
    .onPost("/rpc", {
      method: "aidbox.zen/namespaces",
      params: {},
    })
    .reply(200, { result: ["test"] })
    .onPost("/rpc", `{:method aidbox.zen/symbols :params { :ns test}}`)
    .reply(200, { result: [{ name: "test-symbol" }] });

  const cache = createCache(false, `${process.cwd()}/.test-cache`);

  if (fs.existsSync(cache.cachePath + "/aidbox-symbols.json")) {
    fs.rmSync(cache.cachePath + "/aidbox-symbols.json");
  }
  const result = await box.loadAllSymbols([], [], cache.cachePath, true);

  assert.equal(result, ["test/test-symbol"]);

  mock.reset();
});

boxSuite("[loadAllSymbols] cache exist exist", async () => {
  const cache = createCache(false, `${process.cwd()}/.test-cache`);
  const result = await box.loadAllSymbols([], [], cache.cachePath, true);

  assert.equal(result, ["test/test-symbol"]);

  mock.reset();
});

boxSuite.run();
