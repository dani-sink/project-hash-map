import { LinkedList } from "./linkedList.js";

export function HashMap() {
  const loadFactor = 0.75;
  let capacity = 16;
  let buckets = [];

  for (let i = 0; i < capacity; ++i) {
    buckets.push(null);
  }

  const growArray = function () {
    capacity *= 2;
    const allEntries = entries();
    clear();
    for (const entry of allEntries) {
      const key = entry[0];
      const value = entry[1];
      setWithoutGrow(key, value);
    }
  };

  const hash = function (key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    return hashCode % capacity;
  };

  const setWithoutGrow = function (key, value) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      buckets[index] = LinkedList();
      buckets[index].append([key, value]);
    } else {
      const keyValPairIndex = buckets[index].findIndex([key, value]);
      if (keyValPairIndex === -1) {
        buckets[index].append([key, value]);
      } else {
        buckets[index].replaceAt(keyValPairIndex, [key, value]);
      }
    }
  };

  const set = function (key, value) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      buckets[index] = LinkedList();
      buckets[index].append([key, value]);
    } else {
      const keyValPairIndex = buckets[index].findIndex([key, value]);
      if (keyValPairIndex === -1) {
        buckets[index].append([key, value]);
      } else {
        buckets[index].replaceAt(keyValPairIndex, [key, value]);
      }
    }

    if (this.length() > capacity * loadFactor) {
      growArray();
    }
  };

  const get = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      return undefined;
    } else {
      const targetValue = buckets[index].findByKey(key);
      return targetValue !== undefined ? targetValue[1] : undefined;
    }
  };

  const getCapacity = () => capacity;

  const has = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      return false;
    } else {
      return buckets[index].contains(key);
    }
  };

  const remove = function (key) {
    const index = hash(key);
    if (index < 0 || index >= buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }

    if (buckets[index] === null) {
      return false;
    } else {
      const targetVal = buckets[index].findByKey(key);
      if (targetVal === undefined) {
        return false;
      } else {
        const targetIndex = buckets[index].findIndex(targetVal);
        buckets[index].removeAt(targetIndex);
        return true;
      }
    }
  };

  const length = function () {
    let size = 0;
    for (const bucket of buckets) {
      if (bucket === null) {
        continue;
      }

      size += bucket.size();
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
      if (bucket === null) {
        continue;
      }
      const bucketKeys = bucket.getKeys();
      for (const key of bucketKeys) {
        keys.push(key);
      }
    }

    return keys;
  };

  const values = function () {
    const values = [];
    for (const bucket of buckets) {
      if (bucket === null) {
        continue;
      }
      const bucketValues = bucket.getValues();
      for (const value of bucketValues) {
        values.push(value);
      }
    }

    return values;
  };

  const entries = function () {
    const entries = [];
    for (const bucket of buckets) {
      if (bucket === null) {
        continue;
      }
      const bucketEntries = bucket.getEntries();
      for (const entry of bucketEntries) {
        entries.push(entry);
      }
    }

    return entries;
  };

  return {
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
    getCapacity,
  };
}
