# HashMap

A hash map (and its keys-only sibling, a hash set) implemented from scratch in JavaScript, built for [The Odin Project](https://www.theodinproject.com/lessons/javascript-hashmap). No `Map`, no `Set`, no libraries — just a bucket array, a hashing function, collision handling, and dynamic resizing, so the data structure is visible end to end.

## What it demonstrates

- **Hashing** — turning a string key into a bucket index with a hash function, using a prime multiplier and modulo by the bucket count.
- **Collision handling** via **separate chaining** — each bucket holds multiple entries, so different keys that hash to the same index coexist.
- **Dynamic resizing** — when the number of entries exceeds `capacity × loadFactor` (16 × 0.75), the bucket array grows and every entry is **rehashed** into the larger array.
- **The factory-function pattern** with closed-over private state (the buckets array is never exposed directly).
- **Unit testing with Jest** (via Babel so tests can use ES modules), including the resize path.

## HashMap API

Created by calling `HashMap()` (a factory — no `new`):

```js
import { HashMap } from "./src/hashMap.js";

const map = HashMap();
map.set("apple", "red");
map.set("banana", "yellow");
map.set("apple", "green"); // same key → overwrites, not a duplicate

map.get("apple"); // "green"
map.has("banana"); // true
map.length(); // 2
map.keys(); // ["apple", "banana"]  (order not guaranteed)
```

| Method            | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `set(key, value)` | Add a new entry, or **overwrite** the value if the key already exists.  |
| `get(key)`        | Return the value for `key`, or `null` if it isn't present.              |
| `has(key)`        | Return `true` if `key` is in the map, else `false`.                     |
| `remove(key)`     | Remove the entry; return `true` if something was removed, else `false`. |
| `length()`        | Return the number of stored keys.                                       |
| `clear()`         | Remove every entry.                                                     |
| `keys()`          | Return an array of all keys.                                            |
| `values()`        | Return an array of all values.                                          |
| `entries()`       | Return an array of `[key, value]` pairs.                                |

## HashSet API

A `HashSet` behaves like the map but stores **keys only** — no values, so no `get`, `values`, or `entries`:

```js
import { HashSet } from "./src/hashSet.js";

const set = HashSet();
set.set("apple");
set.set("apple"); // no-op — sets hold no duplicates
set.has("apple"); // true
set.length(); // 1
```

| Method        | Description                                         |
| ------------- | --------------------------------------------------- |
| `set(key)`    | Add a key (no-op if it's already present).          |
| `has(key)`    | Return `true` if `key` is in the set, else `false`. |
| `remove(key)` | Remove the key; return `true`/`false`.              |
| `length()`    | Return the number of stored keys.                   |
| `clear()`     | Remove every key.                                   |
| `keys()`      | Return an array of all keys.                        |

## Project structure

```
project-hashmap/
├── src/
│   ├── hashMap.js       # HashMap factory + hashing, collision & resize logic
│   └── hashSet.js       # HashSet factory (keys-only variant)
├── index.js             # scratch file for manual experimentation
├── hashMap.test.js      # Jest suite for the map
├── hashSet.test.js      # Jest suite for the set
├── babel.config.cjs     # lets Jest run ES modules
└── package.json
```

## Running it

```bash
git clone https://github.com/dani-sink/project-hashmap.git
cd project-hashmap
npm install     # installs Jest + Babel
npm test        # run the test suites
node index.js   # run manual experiments
```

Babel (`@babel/preset-env`) transpiles the `import`/`export` syntax so Jest can run the ES-module source — which is why `npm test` is a plain `jest` with no experimental flags.

## What I learned

- why the hash function multiplies by a prime and takes a modulo (spreading keys across buckets)
- separate chaining made collisions concrete — a bucket is a little list, not a single slot
- the resize/rehash step is where a HashMap stops being "an object with extra steps"
- keeping buckets private in the closure kept the public API clean

---

Part of [The Odin Project](https://www.theodinproject.com/) — Full Stack JavaScript path.
