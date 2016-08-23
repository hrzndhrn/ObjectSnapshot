"use strict"

import {test} from "tape";
// import {dumpChanges} from "./util/dump";
import {Counter} from "./util/Counter";
import {ObjectSnapshot} from "../src/ObjectSnapshot";

test("ObjectSnapshot with class Counter", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  let obj = {
    x: new Counter(1),
    y: new Counter(2),
    z: new Counter()
  };
  let [snapshot, observable] = ObjectSnapshot.create(obj);

  t.ok(snapshot !== undefined, "snapshot is defined");
  t.ok(observable !== undefined, "observable is defined");

  let cx = observable.x;
  let cy = observable.y;
  let cz = observable.z;

  t.equal(cx.count, 1, "cx.count === 2");
  t.equal(cy.count, 2, "cx.count === 1");
  t.equal(cz.count, 0, "cx.count === 0");

  t.false(snapshot.hasChanges(),
      "snapshot has no changes");
  t.false(snapshot.hasChanges("x"),
      "snapshot with key path 'x' has no changes");
  t.false(snapshot.hasChanges("y"),
      "snapshot with key path 'y' has no changes");
  t.false(snapshot.hasChanges("z"),
      "snapshot with key path 'z' has no changes");

  cx.inc();
  cy.dec();

  t.equal(cx.count, 2, "cx.count === 2");
  t.equal(cy.count, 1, "cx.count === 1");
  t.equal(cz.count, 0, "cx.count === 0");

  t.true(snapshot.hasChanges(),
      "snapshot has no changes");
  t.true(snapshot.hasChanges("x"),
      "snapshot with key path 'x' has no changes");
  t.true(snapshot.hasChanges("y"),
      "snapshot with key path 'y'has no changes");
  t.false(snapshot.hasChanges("z"),
      "snapshot with key path 'z' has no changes");

  t.end();
});
