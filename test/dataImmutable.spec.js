"use strict"

import {test} from "tape";
// import {dumpChanges} from "./util/dump";
import {Counter} from "./util/Counter";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot: data and immutable", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
    "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    a: new Counter(1),
    b: [1,2,3],
    c: { x: {y: {z: 44}}},
    d: [
      { a:1, b:2},
      { a:2, b:4},
      { a:3, b:6}
    ],
    e: "foo"
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  t.deepEqual(snapshot.data(), {
    a: {count: 1},
    b: [1,2,3],
    c: { x: {y: {z: 44}}},
    d: [
      { a:1, b:2},
      { a:2, b:4},
      { a:3, b:6}
    ],
    e: "foo"
  }, "get data of unchanged snapshot");

  let immutable = snapshot.immutable();

  t.true(Object.isFrozen(immutable), "the variable immutable is forzen");
  t.true(Object.isFrozen(immutable.c), "the variable.c immutable is forzen");
  t.equal(immutable.c.x.y.z, 44, "the immutable value");
  // try to set immtable value
  t.throws( () => {immutable.c.x.y.z = 44;}, /TypeError/,
    "throws a TypeError exception");

  t.deepEqual(snapshot.data("b"), [1,2,3], "get an array by key path");

  t.deepEqual(snapshot.data("c.x"), {y: {z: 44}},
    "get deep nested object by key path");


  t.throws(() => { snapshot.data("c.e"); }, /SnapshotNotFoundError/,
    "snaphot c.e not found");

  // ---------------------------------------------------------------------------
  t.end();
});
