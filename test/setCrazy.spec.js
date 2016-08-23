// @flow

"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";
import {dumpChanges} from "./util/dump";

test("ObjectSnapshot: set a new object (crazy)", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  t.comment("- create snapshot with {'state': {'a': 1, 'b': 2}}");
  let [snapshot, observable] = ObjectSnapshot.create({
    "state": {
      "a": 1,
      "b": 2
    }
  });
  t.equal(observable.state.a, 1, "observable.state.a === 1");
  t.equal(observable.state.b, 2, "observable.state.b === 2");

  t.comment("- observale.state = {'x': 42, 'y': 2})");
  observable.state = {
    "x": 42,
    "y": 2
  };

  dumpChanges(snapshot);

  t.true(snapshot.hasChanges(), "snapshot has changes");

  t.false(snapshot.hasChanges("state.a"),
      "snapshot has no changes for key path 'state.a'");
  t.false(snapshot.hasChanges("state.a"),
      "snapshot has no changes for key path 'state.b'");
  t.true(snapshot.hasChanges("state.x"),
      "snapshot has changes for key path 'state.x'");

  t.deepEqual(snapshot.data(), {
    "state": {
      "a": 1,
      "b": 2,
      "x": 42,
      "y": 2
    }
  });

  //----------------------------------------------------------------------------
  t.end();
});
