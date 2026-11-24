import { LinkedList } from "./linkedList.js";

export function HashSet() {
  const loadFactor = 0.75;
  let capacity = 16;
  let buckets = [];

  for (let i = 0; i < capacity; ++i) {
    buckets.push(null);
  }

  const hash = function (key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    return hashCode % capacity;
  };

  const growArray = function () {
    capacity *= 2;
    const allKeys = keys();
    clear();
    for (const key of allKeys) {
      setWithoutGrow(key);
    }
  };

  const set = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      buckets[index] = LinkedList();
      buckets[index].append(key);
    } else {
      const target = buckets[index].findByKey(key);
      if (target === undefined) {
        buckets[index].append(key);
      }
    }

    if (length() > capacity * loadFactor) {
      growArray();
    }
  };

  const setWithoutGrow = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      buckets[index] = LinkedList();
      buckets[index].append(key);
    } else {
      const target = buckets[index].findByKey(key);
      if (target === undefined) {
        buckets[index].append(key);
      }
    }
  };

  const get = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      return undefined;
    }
    const target = buckets[index].findByKey(key);
    return target !== undefined ? target : undefined;
  };

  const has = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      return false;
    } else {
      const target = buckets[index].findByKey(key);
      return target !== undefined;
    }
  };

  const remove = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (has(key)) {
      const targetIndex = buckets[index].findIndex(key);
      buckets[index].removeAt(targetIndex);
      return true;
    }

    return false;
  };

  const length = function () {
    let size = 0;
    for (const bucket of buckets) {
      if (bucket !== null) {
        size += bucket.size();
      }
    }

    return size;
  };

  const clear = function () {
    buckets = [];

    for (let i = 0; i < capacity; ++i) {
      buckets.push(null);
    }
  };

  const keys = function () {
    const keys = [];
    for (const bucket of buckets) {
      if (bucket !== null) {
        const bucketKeys = bucket.getKeysSet();
        for (const key of bucketKeys) {
          keys.push(key);
        }
      }
    }

    return keys;
  };

  return {
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
  };
}
