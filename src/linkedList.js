import { Node } from "./node.js";

export function LinkedList() {
  let headNode = null;

  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((val, index) => val === b[index]);

  const append = function (value) {
    if (headNode === null) {
      headNode = Node(value);
      return;
    }

    let current = headNode;

    while (current.next !== null) {
      current = current.next;
    }

    current.next = Node(value);
  };

  const prepend = function (value) {
    if (headNode === null) {
      headNode = Node(value);
      return;
    }

    let newHead = Node(value);
    let currentHead = headNode;
    newHead.next = currentHead;
    headNode = newHead;
  };

  const size = function () {
    if (headNode === null) return 0;

    let count = 0;
    let current = headNode;
    while (current !== null) {
      count++;
      current = current.next;
    }

    return count;
  };

  const head = function () {
    return headNode !== null ? headNode.value : undefined;
  };

  const tail = function () {
    if (headNode === null) return undefined;

    let current = headNode;

    while (current.next !== null) {
      current = current.next;
    }

    return current.value;
  };

  const at = function (index) {
    if (headNode === null) return undefined;

    let current = headNode;
    let curIndex = 0;

    while (current !== null) {
      if (curIndex === index) {
        return current.value;
      }
      current = current.next;
      curIndex++;
    }

    return undefined;
  };

  const pop = function () {
    if (headNode === null) return undefined;

    const previousHead = headNode;
    headNode = headNode.next;
    return previousHead.value;
  };

  const contains = function (value) {
    if (headNode === null) return false;

    let current = headNode;

    while (current !== null) {
      if (Array.isArray(current.value)) {
        const key1 = current.value[0];
        const key2 = value;
        if (key1 === key2) {
          return true;
        }
      }
      if (current.value === value) {
        return true;
      }
      current = current.next;
    }

    return false;
  };

  const findIndex = function (value) {
    if (headNode === null) return -1;

    let current = headNode;
    let curIndex = 0;

    while (current !== null) {
      if (Array.isArray(value) && Array.isArray(current.value)) {
        const key1 = current.value[0];
        const key2 = value[0];
        if (key1 === key2) {
          return curIndex;
        }
      }
      if (current.value === value) {
        return curIndex;
      }
      current = current.next;
      curIndex++;
    }

    return -1;
  };

  const findByKey = function (key) {
    if (headNode === null) return undefined;

    let current = headNode;
    let curIndex = 0;

    while (current !== null) {
      if (Array.isArray(current.value)) {
        if (current.value.includes(key)) {
          return current.value;
        }
      }
      if (current.value === key) {
        return current.value;
      }
      current = current.next;
      curIndex++;
    }

    return undefined;
  };

  const toString = function () {
    if (headNode === null) {
      return "null";
    }

    let current = headNode;
    let stringToPrint = "";

    while (current !== null) {
      stringToPrint += "( " + current.value + " ) -> ";
      current = current.next;
    }

    stringToPrint += "null";

    return stringToPrint;
  };

  const insertAt = function (index, ...values) {
    if (index < 0 || index > this.size()) throw RangeError;

    let current = headNode;
    let previous = null;
    let curIndex = 0;

    while (current !== null) {
      if (curIndex === index) {
        for (const value of values) {
          const newNode = Node(value);
          newNode.next = current;
          if (previous === null) {
            headNode = newNode;
            previous = headNode;
          } else {
            previous.next = newNode;
            previous = newNode;
          }
        }
        return;
      }

      previous = current;
      current = current.next;
      curIndex++;
    }

    for (const value of values) {
      const newNode = Node(value);
      newNode.next = previous.next;
      previous.next = newNode;
      previous = newNode;
    }
  };

  const removeAt = function (index) {
    if (index < 0 || index >= this.size()) throw RangeError;

    let current = headNode;
    let previous = null;
    let curIndex = 0;

    while (current !== null) {
      if (curIndex === index) {
        if (previous === null) {
          headNode = headNode.next;
        } else {
          previous.next = current.next;
          current = previous;
        }
        return;
      }
      previous = current;
      current = current.next;
      curIndex++;
    }
  };

  const getKeys = function () {
    if (headNode === null) return [];

    let current = headNode;
    const keys = [];

    while (current !== null) {
      if (Array.isArray(current.value)) {
        keys.push(current.value[0]);
        current = current.next;
      } else {
        return [];
      }
    }
    return keys;
  };

  const getKeysSet = function () {
    if (headNode === null) return [];

    let current = headNode;
    const keys = [];

    while (current !== null) {
      keys.push(current.value);
      current = current.next;
    }

    return keys;
  };

  const getValues = function () {
    if (headNode === null) return [];

    let current = headNode;
    const values = [];

    while (current !== null) {
      if (Array.isArray(current.value)) {
        values.push(current.value[1]);
        current = current.next;
      } else {
        return [];
      }
    }
    return values;
  };

  const getEntries = function () {
    if (headNode === null) return [];

    let current = headNode;
    const entries = [];

    while (current !== null) {
      if (Array.isArray(current.value)) {
        entries.push([current.value[0], current.value[1]]);
        current = current.next;
      } else {
        return [];
      }
    }
    return entries;
  };

  const replaceAt = function (index, value) {
    if (index < 0 || index >= this.size()) throw RangeError;

    let current = headNode;
    let curIndex = 0;

    while (current !== null) {
      if (curIndex === index) {
        current.value = value;
      }
      current = current.next;
      curIndex++;
    }
  };

  return {
    append,
    prepend,
    size,
    head,
    tail,
    at,
    pop,
    contains,
    findIndex,
    findByKey,
    toString,
    insertAt,
    removeAt,
    replaceAt,
    getKeys,
    getValues,
    getEntries,
    getKeysSet,
  };
}
