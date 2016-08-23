// @flow

"use strict"

import {test} from "tape";
import {ObjectSnapshot} from "../src/ObjectSnapshot";
// import {dumpChanges} from "./util/dump";

test("ObjectSnapshot: list of object", function(t) {
  t.ok(typeof ObjectSnapshot === "function",
      "ObjectSnapshot is imported");

  /* eslint-disable no-magic-numbers */

  t.comment("- create snapshot with a list of objects");
  let [snapshot, observable] = ObjectSnapshot.create({
    list: [
      { "firstname": "Joe"  , "lastname": "Smith", "age": 21 },
      { "firstname": "Sue"  , "lastname": "Boo"  , "age": 41 },
      { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
    ]
  });

  t.false(snapshot.hasChanges(), "snapshot has no changes");

  t.comment("- set same values to list");

  observable.list = [
    { "firstname": "Joe"  , "lastname": "Smith", "age": 21 },
    { "firstname": "Sue"  , "lastname": "Boo"  , "age": 41 },
    { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
  ];

  t.false(snapshot.hasChanges(), "snapshot has no changes");

  t.comment("- set list with one new value (list.1.age = 55)");
  observable.list = [
    { "firstname": "Joe"  , "lastname": "Smith", "age": 21 },
    { "firstname": "Sue"  , "lastname": "Boo"  , "age": 55 },
    { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
  ];

  t.true(snapshot.hasChanges(), "snapshot has changes");
  t.true(snapshot.hasChanges("list.1"),
      "snapshot has changes for key path 'list.1'");
  t.false(snapshot.hasChanges("list.0"),
      "snapshot has no changes for key path 'list.0'");

  t.comment("- snapshot.reset()");
  snapshot.reset();

  t.false(snapshot.hasChanges(), "snapshot has no changes");

  //----------------------------------------------------------------------------
  t.comment("- set list with one new value (list.0.lastname = 'Brown')");

  observable.list = [
    { "firstname": "Joe"  , "lastname": "Brown", "age": 21 },
    { "firstname": "Sue"  , "lastname": "Boo"  , "age": 41 },
    { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
  ];

  t.true(snapshot.hasChanges(), "snapshot has changes");

  t.comment("- snapshot.snapshot()");
  snapshot.snapshot();

  t.false(snapshot.hasChanges(), "snapshot has no changes");

  t.deepEqual(snapshot.data(), {
    list: [
      { "firstname": "Joe"  , "lastname": "Brown", "age": 21 },
      { "firstname": "Sue"  , "lastname": "Boo"  , "age": 41 },
      { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
    ]
  }, "snapshot.data === list");

  t.deepEqual(snapshot.immutable(), {
    list: [
      { "firstname": "Joe"  , "lastname": "Brown", "age": 21 },
      { "firstname": "Sue"  , "lastname": "Boo"  , "age": 41 },
      { "firstname": "Julia", "lastname": "Pong" , "age": 33 }
    ]
  }, "snapshot.immutable === list");

  //----------------------------------------------------------------------------
  t.end();
});
