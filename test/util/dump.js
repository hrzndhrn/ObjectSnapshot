function _dumpChanges(snapshot, keyPath="") {
  let changed = snapshot._changed;
  let subs = snapshot._mapSubSnapshots;
  console.log("keyPath = " + keyPath);
  changed.forEach((value,key) => {
    console.log(`${keyPath}${key} = ${value}`);
  });
  subs.forEach((value,key) => {
    _dumpChanges(value, key + ".");
  });
}

function dumpChanges(snapshot, keyPath="") {
  console.log("--- dump ---");
  _dumpChanges(snapshot, keyPath);
  console.log("--- end ---");
}

export {dumpChanges};
