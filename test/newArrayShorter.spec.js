"use strict"

import {test} from "tape";
import {dumpChanges} from "./util/dump";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

function arrayEqual( expected, actual) {
  let result = expected.length === actual.length;

  if (result) {
    result = expected.every(
      (currentValue, index) => currentValue === actual[index]
    );
  }

  return result;
}

test("ObjectSnapshot: new array shorter", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    x: [1, 2, 3, 4],
    y: {foo: "bar"},
    z: 9
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);
  let array, keyPath;

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set a new array");

  array = [1, 2, 3, 4];
  t.true(arrayEqual(observable.x, array), `observable.x === ${array}`);
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  observable.x = [11, 22];

  array = [11, 22];
  t.true(arrayEqual(observable.x, array), `observable.x === ${array}`);
  t.true(snapshot.hasChanges(), "snapshot has changes");
  keyPath = "x";
  t.true(snapshot.hasChanges(keyPath),
      `snapshot with key path "${keyPath}" has changes`);

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: reset");

  dumpChanges(snapshot);

  snapshot.reset();

  array = [1, 2, 3, 4];
  t.true(arrayEqual(observable.x, array), `observable.x === ${array}`);
  // t.deepEqual( observable.x, array, `observable.x === ${array}`);
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: new snapshot");

  observable.x = [11, 22, 33, 44];

  array = [11, 22, 33, 44];
  t.true(arrayEqual(observable.x, array), `observable.x === ${array}`);
  t.true(snapshot.hasChanges(), "snapshot has changes");

  snapshot.snapshot();

  t.true(arrayEqual(observable.x, array), `observable.x === ${array}`);
  t.false(snapshot.hasChanges(), "snapshot has no changes");

  //----------------------------------------------------------------------------
  t.end();
});
