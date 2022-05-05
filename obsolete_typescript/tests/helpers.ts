import { suite } from "uvu";
import assert from "uvu/assert";
import * as helpers from "../lib/helpers";
import fastCheck from "fast-check";

const helpersSuite = suite("Helpers");

helpersSuite("[capitalize] is idempotent", () => {
  fastCheck.assert(
    fastCheck.property(fastCheck.string(), (text) => {
      const result = helpers.capitalize(text);

      assert.equal(result, helpers.capitalize(result));
    }),
  );
});

helpersSuite("[capitalize] preserves string length", () => {
  fastCheck.assert(
    fastCheck.property(fastCheck.string(), (text) => {
      const result = helpers.capitalize(text);

      assert.equal(result.length, text.length);
    }),
  );
});

helpersSuite("[capitalize] preserves order", () => {
  fastCheck.assert(
    fastCheck.property(fastCheck.string(), (text) => {
      const result = helpers.capitalize(text);
      const mapping = text
        .split("")
        .map(
          (val, index) =>
            val.toLowerCase() === result.split("")[index].toLowerCase(),
        );
      assert.ok(mapping.every(Boolean));
    }),
  );
});

helpersSuite(
  "[capitalize] equivalent to .toUpperCase for 1 character strings",
  () => {
    fastCheck.assert(
      fastCheck.property(
        fastCheck.string({ minLength: 1, maxLength: 1 }),
        (text) => {
          const result = helpers.capitalize(text);
          assert.equal(result, text.toUpperCase());
        },
      ),
    );
  },
);

helpersSuite("[capitalize] does not respect addition", () => {
  fastCheck.assert(
    fastCheck.property(
      fastCheck.string().filter((item) => /^[a-z]+$/.test(item)),
      fastCheck.string().filter((item) => /^[a-z]+$/.test(item)),
      (textA, textB) => {
        const result = helpers.capitalize(textA);
        const result2 = helpers.capitalize(textB);
        assert.not(result + result2 === helpers.capitalize(textA + textB));
      },
    ),
  );
});

helpersSuite("[capitalize] does not affect UPPERCASE values", () => {
  fastCheck.assert(
    fastCheck.property(
      fastCheck.string().filter((item) => /^[A-Z]+$/.test(item)),
      (text) => {
        const result = helpers.capitalize(text);
        assert.equal(result, text);
      },
    ),
  );
});

helpersSuite("[wrapKey] input parameter no string", () => {
  assert.equal(helpers.wrapKey(""), "");
});

helpersSuite("[wrapKey] correct parameter", () => {
  assert.equal(helpers.wrapKey("test-test"), "'test-test'");
  assert.equal(helpers.wrapKey("test"), "test");
});

helpersSuite("[wrapKey] is idempotent", () => {
  fastCheck.assert(
    fastCheck.property(fastCheck.string(), (text) => {
      const result = helpers.wrapKey(text);
      assert.equal(result, helpers.wrapKey(result));
    }),
  );
});

helpersSuite("[normalizeConfirms] incorrect input", () => {
  assert.equal(helpers.normalizeConfirms([], ""), {});
});

helpersSuite("[normalizeConfirms] with empty array", () => {
  assert.equal(helpers.normalizeConfirms([], "Test"), {});
});

helpersSuite("[normalizeConfirms] name equal first element in array", () => {
  assert.equal(
    helpers.normalizeConfirms(["DeviceRequest"], "DeviceRequest"),
    {},
  );
});

helpersSuite("[normalizeConfirms] name don't exist in input array", () => {
  assert.equal(
    helpers.normalizeConfirms(
      ["DeviceRequest", "Encounter", "Appointment"],
      "Patient",
    ),
    { extends: ["DeviceRequest", "Encounter", "Appointment"] },
  );
});

helpersSuite("[normalizeConfirms] name exist in input array", () => {
  assert.equal(
    helpers.normalizeConfirms(
      ["DeviceRequest", "Encounter", "Appointment"],
      "Encounter",
    ),
    { extends: ["DeviceRequest", "Appointment"] },
  );
});

helpersSuite("[getPrimitiveTypes] general", () => {
  assert.is(helpers.convertPrimitive("zen/coll"), "any");
});

helpersSuite.run();
