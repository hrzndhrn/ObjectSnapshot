"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot with array", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    x: [1, 2, 3],
    y: {foo: "bar"},
    z: 9
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);
  let keyPath;

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: get values");

  t.equal(observable.x[0], 1, "observable.x[0] === 1");
  t.equal(observable.x[1], 2, "observable.x[1] === 2");
  t.equal(observable.x[2], 3, "observable.x[2] === 3");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set values");

  observable.x[0] = 11;
  observable.x[2] = 13;

  t.equal(observable.x[0], 11, "observable.x[0] === 11");
  t.equal(observable.x[1], 2, "observable.x[1] === 2");
  t.equal(observable.x[2], 13, "observable.x[2] === 13");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: detect changes after set values");

  t.true(snapshot.hasChanges(), "snapshote has changes");

  keyPath = "x";
  t.true(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has changes`);

  keyPath = "y";
  t.false(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has no changes`);

  //----------------------------------------------------------------------------
  t.end();
});
