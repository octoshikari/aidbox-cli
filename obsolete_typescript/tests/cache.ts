import * as sut from "../lib/cache";
import { suite } from "uvu";
import assert from "uvu/assert";
import fs from "fs";

const cacheSuite = suite("Cache");

cacheSuite.before.each(() => {
  if (fs.existsSync(`${process.cwd()}/.cache`))
    fs.rmSync(`${process.cwd()}/.cache`, { recursive: true });
  if (fs.existsSync(`${process.cwd()}/.test-cache`))
    fs.rmSync(`${process.cwd()}/.test-cache`, { recursive: true });
});

cacheSuite("custom cache path should be created", () => {
  const cache = sut.createCache(true, `${process.cwd()}/.test-cache`);
  assert.is(cache.cachePath, `${process.cwd()}/.test-cache`);
  assert.is(fs.existsSync(cache.cachePath), true);
  cache.clearFolder();
});

cacheSuite("return empty set for all cache items", () => {
  const cache = sut.createCache(true);
  assert.is(cache.cachePath, `${process.cwd()}/.cache`);
  assert.is(fs.existsSync(cache.cachePath), true);
  assert.is(cache.confirms.size, 0);
  assert.is(cache.schema.size, 0);
  assert.is(cache.valueSets.size, 0);
  cache.clearFolder();
  assert.is(fs.existsSync(cache.cachePath), false);
});

cacheSuite("pre-init confirms file", () => {
  fs.mkdirSync(`${process.cwd()}/.cache`);
  fs.writeFileSync(
    `${process.cwd()}/.cache/confirms.json`,
    JSON.stringify({ test: "test" }),
  );
  const cache = sut.createCache(true);
  assert.is(cache.cachePath, `${process.cwd()}/.cache`);

  assert.is(fs.existsSync(cache.cachePath), true);
  assert.is(cache.confirms.size, 1);
  assert.is(cache.schema.size, 0);
  assert.is(cache.valueSets.size, 0);
  cache.clearFolder();
  assert.is(fs.existsSync(cache.cachePath), false);
});

cacheSuite("save into file if first argument true", () => {
  const cache = sut.createCache(true, `${process.cwd()}/.test-cache`);
  assert.is(fs.existsSync(cache.cachePath), true);
  assert.is(cache.save(), undefined);
  assert.is(fs.existsSync(`${process.cwd()}/.test-cache/confirms.json`), true);
  cache.clearFolder();
});

cacheSuite.run();
