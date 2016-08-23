"use strict"

import {test} from "tape";
// import {dumpChanges} from "./util/dump";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot: assign object", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    x: [1, 2, 3],
    y: {foo: "bar"},
    z: 9
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);

  Object.assign(observable, {z:42});

  t.equal(observable.z, 42, "observable.z === 42");

  t.true(snapshot.hasChanges(), "snapshot has changes");
  t.false(snapshot.hasChanges("y"), "snapshot has no changes for key path 'y'");

  // --------------------------------------------------------------------------
  t.end();
});
