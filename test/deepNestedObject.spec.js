"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot with deep nested objects", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    a: {b: {c: {d: 1}}, x:{y: {z: 0}}},
    q: 2
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  //----------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set value");

  observable.a.b.c.d = 2;

  t.true(snapshot.hasChanges());
  t.true(snapshot.hasChanges("a"));
  t.true(snapshot.hasChanges("a.b"));
  t.true(snapshot.hasChanges("a.b.c"));
  t.true(snapshot.hasChanges("a.b.c.d"));

  t.false(snapshot.hasChanges("q"));

  //----------------------------------------------------------------------------
  t.end();
});
