// @flow

"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";
import {dumpChanges} from "./util/dump";

test.skip("ObjectSnapshot: set a new object (crazy)", function(t) {
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

  t.comment("- delete observable.state.a");
  t.true(snapshot.hasChanges());

  t.deepEqual(snapshot.data(), {"state": {"b": 2}});

  //----------------------------------------------------------------------------
  t.end();
});
