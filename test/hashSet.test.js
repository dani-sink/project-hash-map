import { HashSet } from "../src/hashSet.js";

const makeSet = () => HashSet();
const addKey = (s, key) => s.set(key);

// Keys only this time (reuse the HashMap sample's keys) — 12 keys sit right
// at the load-factor threshold for a capacity-16 set (16 * 0.75 = 12).
const SAMPLE = [
  "apple",
  "banana",
  "carrot",
  "dog",
  "elephant",
  "frog",
  "grape",
  "hat",
  "ice cream",
  "jacket",
  "kite",
  "lion",
];

const populate = (set, keys = SAMPLE) => {
  for (const k of keys) addKey(set, k);
  return set;
};

const sortedKeys = (set) => [...set.keys()].sort();

describe("HashSet — empty set", () => {
  let set;
  beforeEach(() => {
    set = makeSet();
  });

  test("length starts at 0", () => {
    expect(set.length()).toBe(0);
  });

  test("has returns false for a missing key", () => {
    expect(set.has("nope")).toBe(false);
  });

  test("remove returns false for a missing key", () => {
    expect(set.remove("nope")).toBe(false);
  });

  test("keys is an empty array", () => {
    expect(set.keys()).toEqual([]);
  });
});

describe("HashSet — add & has", () => {
  let set;
  beforeEach(() => {
    set = makeSet();
  });

  test("adding a key stores it", () => {
    addKey(set, "apple");
    expect(set.has("apple")).toBe(true);
    expect(set.length()).toBe(1);
  });

  test("adding the SAME key again is a no-op (no duplicates, length unchanged)", () => {
    addKey(set, "apple");
    addKey(set, "apple");
    expect(set.length()).toBe(1); // still one, not two
    expect(set.keys().filter((k) => k === "apple")).toHaveLength(1);
  });

  test("distinct keys are stored independently", () => {
    addKey(set, "apple");
    addKey(set, "banana");
    expect(set.has("apple")).toBe(true);
    expect(set.has("banana")).toBe(true);
    expect(set.length()).toBe(2);
  });

  test("has is false for absent keys", () => {
    populate(set);
    expect(set.has("moon")).toBe(false);
  });
});

describe("HashSet — remove", () => {
  let set;
  beforeEach(() => {
    set = populate(makeSet());
  });

  test("returns true and deletes an existing key", () => {
    expect(set.remove("apple")).toBe(true);
    expect(set.has("apple")).toBe(false);
    expect(set.length()).toBe(SAMPLE.length - 1);
  });

  test("returns false for a key that is not there", () => {
    expect(set.remove("moon")).toBe(false);
    expect(set.length()).toBe(SAMPLE.length);
  });

  test("removing then re-adding the same key works", () => {
    set.remove("apple");
    addKey(set, "apple");
    expect(set.has("apple")).toBe(true);
    expect(set.length()).toBe(SAMPLE.length);
  });
});

describe("HashSet — length & clear", () => {
  test("length reflects adds, duplicate adds, and removes", () => {
    const set = makeSet();
    expect(set.length()).toBe(0);
    addKey(set, "a");
    addKey(set, "b");
    expect(set.length()).toBe(2);
    addKey(set, "a"); // duplicate → no change
    expect(set.length()).toBe(2);
    set.remove("b");
    expect(set.length()).toBe(1);
  });

  test("clear empties the set", () => {
    const set = populate(makeSet());
    expect(set.length()).toBe(SAMPLE.length);
    set.clear();
    expect(set.length()).toBe(0);
    expect(set.keys()).toEqual([]);
    expect(set.has("apple")).toBe(false);
  });
});

describe("HashSet — keys", () => {
  test("keys() returns every key exactly once (order-independent)", () => {
    const set = populate(makeSet());
    const expected = [...SAMPLE].sort();
    expect(sortedKeys(set)).toEqual(expected);
  });
});

describe("HashSet — growth / rehash past the load factor", () => {
  test("adding a 13th key triggers a resize and keeps every key present", () => {
    const set = populate(makeSet()); // 12 keys — at the threshold
    addKey(set, "moon"); // 13th — should push past 16 * 0.75 and grow

    expect(set.length()).toBe(13);
    for (const k of SAMPLE) {
      expect(set.has(k)).toBe(true);
    }
    expect(set.has("moon")).toBe(true);
  });

  test("a large number of keys all survive multiple resizes", () => {
    const set = makeSet();
    const n = 50;
    for (let i = 0; i < n; i++) addKey(set, `key${i}`);

    expect(set.length()).toBe(n);
    for (let i = 0; i < n; i++) {
      expect(set.has(`key${i}`)).toBe(true);
    }

    // a duplicate add after growth is still a no-op
    addKey(set, "key0");
    expect(set.length()).toBe(n);
  });
});
