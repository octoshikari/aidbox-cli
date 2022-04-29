import { suite } from "uvu";
import { createBox } from "../lib/box";
import MockAdapter from "axios-mock-adapter";

const readerSuite = suite("Reader");

const box = createBox({
  box: "http://localhost:8091",
  client: "root",
  secret: "secret",
});

// const cache = createCache(false);
const mock = new MockAdapter(box.instance);

mock.onAny().reply(200, { result: { model: {} } });

readerSuite("init", async () => {
  // assert.equal(await sut.parseSymbol(box, cache, "test"), []);
});

readerSuite.run();
