import { HashMap } from "../src/hashMap.js";

const makeMap = () => HashMap();

// The project's own sample data — 12 entries, which sits right at the
// load-factor threshold for a capacity-16 map (16 * 0.75 = 12).
const SAMPLE = [
  ["apple", "red"],
  ["banana", "yellow"],
  ["carrot", "orange"],
  ["dog", "brown"],
  ["elephant", "gray"],
  ["frog", "green"],
  ["grape", "purple"],
  ["hat", "black"],
  ["ice cream", "white"],
  ["jacket", "blue"],
  ["kite", "pink"],
  ["lion", "golden"],
];

const populate = (map, pairs = SAMPLE) => {
  for (const [k, v] of pairs) map.set(k, v);
  return map;
};

// order-independent helpers
const sortedKeys = (map) => [...map.keys()].sort();
const sortedValues = (map) => [...map.values()].sort();
const sortedEntries = (map) =>
  [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));

describe("HashMap — empty map", () => {
  let map;
  beforeEach(() => {
    map = makeMap();
  });

  test("length starts at 0", () => {
    expect(map.length()).toBe(0);
  });

  test("get returns undefined for a missing key", () => {
    expect(map.get("nope")).toBeUndefined();
  });

  test("has returns false for a missing key", () => {
    expect(map.has("nope")).toBe(false);
  });

  test("remove returns false for a missing key", () => {
    expect(map.remove("nope")).toBe(false);
  });

  test("keys / values / entries are empty arrays", () => {
    expect(map.keys()).toEqual([]);
    expect(map.values()).toEqual([]);
    expect(map.entries()).toEqual([]);
  });
});

describe("HashMap — set & get", () => {
  let map;
  beforeEach(() => {
    map = makeMap();
  });

  test("set then get returns the stored value", () => {
    map.set("apple", "red");
    expect(map.get("apple")).toBe("red");
    expect(map.length()).toBe(1);
  });

  test("setting an existing key OVERWRITES the value and does not grow length", () => {
    map.set("apple", "red");
    map.set("apple", "green"); // same key, new value
    expect(map.get("apple")).toBe("green");
    expect(map.length()).toBe(1); // still one entry, not two
  });

  test("distinct keys are stored independently", () => {
    map.set("apple", "red");
    map.set("banana", "yellow");
    expect(map.get("apple")).toBe("red");
    expect(map.get("banana")).toBe("yellow");
    expect(map.length()).toBe(2);
  });
});

describe("HashMap — has", () => {
  let map;
  beforeEach(() => {
    map = populate(makeMap());
  });

  test("true for present keys", () => {
    expect(map.has("apple")).toBe(true);
    expect(map.has("lion")).toBe(true);
  });

  test("false for absent keys", () => {
    expect(map.has("moon")).toBe(false);
  });
});

describe("HashMap — remove", () => {
  let map;
  beforeEach(() => {
    map = populate(makeMap());
  });

  test("returns true and deletes an existing key", () => {
    expect(map.remove("apple")).toBe(true);
    expect(map.has("apple")).toBe(false);
    expect(map.get("apple")).toBeUndefined();
    expect(map.length()).toBe(SAMPLE.length - 1);
  });

  test("returns false for a key that is not there", () => {
    expect(map.remove("moon")).toBe(false);
    expect(map.length()).toBe(SAMPLE.length);
  });

  test("removing then re-setting the same key works", () => {
    map.remove("apple");
    map.set("apple", "crimson");
    expect(map.get("apple")).toBe("crimson");
    expect(map.length()).toBe(SAMPLE.length);
  });
});

describe("HashMap — length & clear", () => {
  test("length reflects inserts, overwrites, and removes", () => {
    const map = makeMap();
    expect(map.length()).toBe(0);
    map.set("a", 1);
    map.set("b", 2);
    expect(map.length()).toBe(2);
    map.set("a", 99); // overwrite → no change
    expect(map.length()).toBe(2);
    map.remove("b");
    expect(map.length()).toBe(1);
  });

  test("clear empties the map", () => {
    const map = populate(makeMap());
    expect(map.length()).toBe(SAMPLE.length);
    map.clear();
    expect(map.length()).toBe(0);
    expect(map.keys()).toEqual([]);
    expect(map.get("apple")).toBeUndefined();
    expect(map.has("apple")).toBe(false);
  });
});

describe("HashMap — keys / values / entries", () => {
  let map;
  beforeEach(() => {
    map = populate(makeMap());
  });

  test("keys() returns every key (order-independent)", () => {
    const expected = SAMPLE.map(([k]) => k).sort();
    expect(sortedKeys(map)).toEqual(expected);
  });

  test("values() returns every value (order-independent)", () => {
    const expected = SAMPLE.map(([, v]) => v).sort();
    expect(sortedValues(map)).toEqual(expected);
  });

  test("entries() returns every [key, value] pair (order-independent)", () => {
    const expected = [...SAMPLE].sort((a, b) => a[0].localeCompare(b[0]));
    expect(sortedEntries(map)).toEqual(expected);
  });

  test("entries reflect an overwrite, not a duplicate", () => {
    map.set("apple", "crimson");
    expect(map.length()).toBe(SAMPLE.length);
    expect(map.get("apple")).toBe("crimson");
    // 'apple' appears exactly once in keys
    expect(map.keys().filter((k) => k === "apple")).toHaveLength(1);
  });
});

describe("HashMap — growth / rehash past the load factor", () => {
  test("adding a 13th entry triggers a resize and keeps every entry retrievable", () => {
    const map = populate(makeMap()); // 12 entries — at the threshold
    map.set("moon", "silver"); // 13th — should push past 16 * 0.75 and grow

    expect(map.length()).toBe(13);

    // everything that went in is still gettable after the rehash
    for (const [k, v] of SAMPLE) {
      expect(map.get(k)).toBe(v);
    }
    expect(map.get("moon")).toBe("silver");
  });

  test("a large number of entries all survive multiple resizes", () => {
    const map = makeMap();
    const n = 50;
    for (let i = 0; i < n; i++) map.set(`key${i}`, `value${i}`);

    expect(map.length()).toBe(n);
    for (let i = 0; i < n; i++) {
      expect(map.get(`key${i}`)).toBe(`value${i}`);
    }

    // overwrite after growth still updates in place
    map.set("key0", "updated");
    expect(map.get("key0")).toBe("updated");
    expect(map.length()).toBe(n);
  });
});
