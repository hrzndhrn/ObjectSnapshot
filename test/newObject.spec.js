"use strict"

import {test} from "tape";
// import {dumpChanges} from "./util/dump";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot: new object", function(t) {
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

  // --------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set a new object");

  t.deepEqual(observable.y, {foo:"bar"},
      "observable.y === {foo: 'bar'}");
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  observable.y = {foo: "baz"};

  t.deepEqual(observable.y, {foo: "baz"},
      "observable.x === {foo: 'baz'}");
  t.true(snapshot.hasChanges(), "snapshot has changes");
  keyPath = "y";
  t.true(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has changes`);

  // --------------------------------------------------------------------------
  t.comment("ObjectSnapshot: reset");

  snapshot.reset();

  t.deepEqual(observable.y, {foo:"bar"},
      "observable.y === {foo: 'bar'}");
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  // --------------------------------------------------------------------------
  t.comment("ObjectSnapshot: new snapshot");

  observable.y = {foo: "baz"};

  t.deepEqual(observable.y, {foo:"baz"},
      "observable.x === {foo:'baz'}");
  t.true(snapshot.hasChanges(), "snapshot has changes");

  snapshot.snapshot();

  t.deepEqual(observable.y, {foo:"baz"},
      "observable.x === {foo:'baz'}");
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  // --------------------------------------------------------------------------
  t.end();
});
