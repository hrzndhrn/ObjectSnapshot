"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot with nested objects", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    x: { a: 1, b: 2, c:3},
    y: { foo: "bar"},
    z: 9
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);
  let keyPath;

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: get values");

  t.equal(observable.x.a, 1, "observable.x.a === 1");
  t.equal(observable.x.b, 2, "observable.x.a === 2");
  t.equal(observable.x.c, 3, "observable.x.a === 3");
  t.equal(observable.y.foo, "bar", "observable.y.foo === \"bar\"");
  t.equal(observable.z, 9, "observable.x.a === 9");
  t.deepEqual(observable.x, {a:1, b:2, c:3},
      "observable.x === {a:1, b:2, c:3}");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set values");

  observable.x.b = 22;
  t.equal(observable.x.b, 22, "observable.x.a === 22");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: detect changes");

  t.true(snapshot.hasChanges(), "snapshot has changes");

  keyPath = "x";
  t.true(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has changes`);

  keyPath = "y";
  t.false(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has no changes`);

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set value back");

  observable.x.b = 2;
  t.equal(observable.x.b, 2, "observable.x.a === 2");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: detect changes again");

  t.false(snapshot.hasChanges(), "snapshot has no changes");

  keyPath = "x";
  t.false(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has no changes`);

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: change values and reset");

  observable.x.b = 33;
  observable.x.c = 34;

  t.deepEqual(observable.x, {a:1, b:33, c:34},
      "observable.x === {a:1, b:33, c: 34}");

  t.true(snapshot.hasChanges(),
      "snapshot has changes before calling reset");

  snapshot.reset();

  t.false(snapshot.hasChanges(),
      "snapshot has ino changes after calling reset");

  t.deepEqual(observable.x, {a:1, b:2, c:3},
      "observable.x === {a:1, b:2, c: 3}");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: change values and snapshot");

  observable.x.b = 33;
  observable.x.c = 34;

  t.deepEqual(observable.x, {a:1, b:33, c:34},
      "observable.x === {a:1, b:33, c: 34}");

  t.true(snapshot.hasChanges(),
      "snapshot has changes before calling snapshot");

  snapshot.snapshot();

  t.false(snapshot.hasChanges(),
      "snapshot has ino changes after calling snapshot");

  t.deepEqual(observable.x, {a:1, b:33, c:34},
      "observable.x === {a:1, b:33, c: 34}");

  t.end();
});
