"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot with a simple object", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let snapshot = new ObjectSnapshot({a:1, b:2, c:3});
  let observable = snapshot.observable();

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: get values");

  t.equal(observable.a, 1, "observable.a === 1");
  t.equal(observable.b, 2, "observable.b === 2");
  t.equal(observable.c, 3, "observable.c === 3");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: check for changes on unchanged snapshot");
  t.false(snapshot.hasChanges(), "snapshot has no changes");
  t.false(snapshot.hasOwnChanges(), "snapshot has no own changes");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set values (a = 4, c = 6)");

  observable.a = 4;
  observable.c = 6;

  t.equal(observable.a, 4, "observable.ai === 4");
  t.equal(observable.b, 2, "observable.b === 2");
  t.equal(observable.c, 6, "observable.c === 6");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: check for changes on changed snapshot");
  t.true(snapshot.hasChanges(), "snapshot has changes");
  t.true(snapshot.hasOwnChanges(), "snapshot has own changes");
  t.true(snapshot.hasChanges("a"), "snapshot has changes for key path 'a'");
  t.false(snapshot.hasChanges("b"), "snapshot has no changes for key path 'b'");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: reset changes");
  snapshot.reset();

  t.equal(observable.a, 1, "observable.a === 1");
  t.equal(observable.b, 2, "observable.b === 2");
  t.equal(observable.c, 3, "observable.c === 3");

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: set values (a = 14, b = 6)");

  observable.a = 14;
  observable.b = 4;

  // ---------------------------------------------------------------------------
  t.comment("ObjectSnapshot: take snapshot");

  t.true(snapshot.hasChanges(),
      "snapshot has changes before calling snapshot");
  t.true(snapshot.hasOwnChanges(),
      "snapshot has own changes before calling snapshot");

  snapshot.snapshot();

  t.false(snapshot.hasChanges(),
      "snapshot has no changes after calling snapshot");
  t.false(snapshot.hasOwnChanges(),
      "snapshot has no own changes after calling snapshot");

  t.equal(observable.a, 14, "observable.a === 14");
  t.equal(observable.b, 4, "observable.b === 4");
  t.equal(observable.c, 3, "observable.c === 3");

  // ---------------------------------------------------------------------------
  t.end();
});
