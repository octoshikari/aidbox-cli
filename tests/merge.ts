import { merge } from "../lib/merge";
import { suite } from "uvu";
import assert from "uvu/assert";

const object1 = {
  array: ["a"],
  date: new Date("2020-01-01"),
  functions: {
    func1: () => "Object 1",
    func2: () => "Object 1",
  },
  nest: {
    nest: {
      a: 1,
      b: 2,
    },
  },
  object: {
    a: 1,
    b: 2,
  },
};
const object1Backup = { ...object1 };

const object2 = {
  nest: {
    nest: {
      b: 3,
      d: 5,
    },
  },
  object: {
    b: undefined,
    c: 3,
    d: 5,
  },
};
const object2Backup = { ...object2 };

const object3 = {
  array: ["b", "c", "a"],
  date: new Date("2020-01-02"),
  functions: {
    func2: () => "Object 3",
    func3: () => "Object 3",
  },
  nest: {
    nest: {
      c: 4,
    },
  },
  object: {
    d: null,
  },
};
const object3Backup = { ...object3 };

const namedObject = {
  propertyA: ["a", "b"],
  propertyB: "propertyB",
};
const result = merge(object1, object2, object3);

const mergeSuite = suite("Merge");

mergeSuite("merges arrays correctly", () => {
  assert.equal(result.array, ["a", "b", "c"]);
});

mergeSuite("merges objects with functions correctly", () => {
  assert.equal(Object.keys(result.functions), ["func1", "func2", "func3"]);

  assert.is(result.functions.func1(), "Object 1");
  assert.is(result.functions.func2(), "Object 3");
  assert.is(result.functions.func3(), "Object 3");
});

mergeSuite("merges nested objects correctly", () => {
  assert.equal(result.nest, {
    nest: {
      a: 1,
      b: 3,
      c: 4,
      d: 5,
    },
  });
});

mergeSuite("merges objects with undefined values correctly", () => {
  assert.equal(result.object, {
    a: 1,
    b: undefined,
    c: 3,
    d: null,
  });
});

mergeSuite("doesn't mutate the arguments", () => {
  assert.equal(object1, object1Backup);
  assert.equal(object2, object2Backup);
  assert.equal(object3, object3Backup);
});

mergeSuite("overrides date correctly", () => {
  assert.equal(result.date, object3.date);
});

mergeSuite("retains Date instance", () => {
  assert.instance(result.date, Date);
});

mergeSuite("merges a named object", () => {
  assert.equal(merge(namedObject, { propertyB: "merged" }), {
    propertyA: namedObject.propertyA,
    propertyB: "merged",
  });
});

mergeSuite(
  "[with options] doesn't merge arrays when mergeArrays is false",
  () => {
    assert.equal(
      merge.withOptions(
        {
          mergeArrays: false,
        },
        object1,
        object2,
        object3,
      ).array,
      object3.array,
    );
  },
);

mergeSuite("[with options] resets the options after calling it", () => {
  assert.equal(merge(object1, object2, object3).array, ["a", "b", "c"]);
});

mergeSuite.run();
