// @flow

"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";
import {dumpChanges} from "./util/dump";

test("ObjectSnapshot: set a new object (simple)", function(t) {
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

  t.comment("- observale.state = {'a': 42, 'b': 2})");

  observable.state = {
    "a": 42,
    "b": 2
  };

  dumpChanges(snapshot);

  t.true(snapshot.hasChanges(), "snapshot has changes");

  t.true(snapshot.hasChanges("state.a"),
      "snapshot has changes for key path 'state.a'");
  t.false(snapshot.hasChanges("state.b"),
      "snapshot has no changes for key path 'state.b'");



  //----------------------------------------------------------------------------
  t.end();
});
