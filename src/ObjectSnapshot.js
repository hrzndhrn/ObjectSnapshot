// @flow

/**
 * @module ObjectSnapshot
 * ObjectSnapshot is an observer for objects. A snapshot of an objects knows
 * whether an observable has any changes or not. If an observable has any
 * changes then the snapshot can reset or commit this changes.
 *
 * The implementation used the JavaScript Proxy.
 */

import {isObject, isArray} from "jsz-isType";
import {EMPTY_STRING, isEmptyString} from "jsz-string";
import {proxify} from "./proxify";
import {
  SnapshotNotFoundError,
  keyPathToArray
} from "./util";

class ObjectSnapshot {
  /**
   * A map of sub snapshots.
   */
  _mapSubSnapshots: Map<string, ObjectSnapshot>;

  /**
   * Contains all changes of the observed object.
   */
  _changed: Map<string,any>;

  /**
   * Contains the initial length of an observed array.
   */
  _initialArrayLength: number;

  /**
   * The proxy for this snapshot.
   */
  _proxy: Proxy<Object>;

  /**
   * The object that this snpashot will be observe.
   */
  _object: any;

  /**
   * Creates a snapshot of the {@link object}.
   */
  constructor(object:any) {
    this._changed = new Map();
    this._proxy = proxify(object, this);
    this._mapSubSnapshots = new Map();
    this._object = object;

    Object.entries(object).forEach(([key,value]) => {
      if(isObject(value) || isArray(value)) {
        this._mapSubSnapshots.set(key, new ObjectSnapshot(value));
      }
    });
  }

  /**
   * Returns true if the snapshot has changes. All eventual existing sub
   * snapshots will be ignored.
   */
  hasOwnChanges() {
    return this._changed.size  > 0;
  }

  /**
   * Returns true if the snapshot or any sub snapshot has changes.
   * @param keyPath - The key path to a specific sub snapshot.
   */
  hasChanges(keyPath:string = EMPTY_STRING): boolean {
    return this._hasChanges(keyPathToArray(keyPath));
  }

  /**
   * Returns true if the snapshot or any sub snapshot has changes.
   * @param - The keys of a key ptah to a specific sub snapshot.
   */
  _hasChanges(keys: Array<string>): boolean {
    let changes = false;

    if (keys.length === 0) {
      changes =  this.hasOwnChanges() || this.hasSubChanges();
    } else {
      let key = keys.shift();
      changes = this._changed.has(key)

      if (!changes) {
        let subSnapshot = this._mapSubSnapshots.get(key);
        changes = subSnapshot !== undefined && subSnapshot._hasChanges(keys);
      }
    }

    return changes;
  }

  /**
   * Returns true if any sub snapshot has changes.
   */
  hasSubChanges() {
    return Array.from(this._mapSubSnapshots.values())
      .some((snapshot) => snapshot.hasChanges());
  }

  /**
   * Takes a snapshot of the current data. Atfer calling this function the
   * snapshot will return false for {@link hasChanges}.
   */
  snapshot() {
    // The changes are obsolete.
    this._changed = new Map();

    if (isArray(this._object)) {
      this._initialArrayLength = this._object.length;
    }

    // call snapshot for all sub-snapshots
    this._mapSubSnapshots.forEach( (sub) => sub.snapshot());
  }

  /**
   * Returns a snapshot for a given key path.
   * @param keys - The keys of a key path.
   */
  _getSubSnapshot(keys: Array<string>) {
    let subSnapshot = this._mapSubSnapshots.get(keys.shift());

    if (!subSnapshot) {
      throw new SnapshotNotFoundError();
    }

    return  keys.length === 0
      ? subSnapshot
      : subSnapshot._getSubSnapshot(keys);
  }

  /**
   * Returns the data of the observed object as a JSPO (JavaScript plain
   * object).
   *
   * @paran keyPath - The key path to a specific snapshot.
   * @param immutable - If this flag is set to true, the data will be returned
   *                    as a immutable JSPO.
   */
  data(keyPath: string = EMPTY_STRING, immutable: boolean = false) {
    try {
      return isEmptyString(keyPath)
        ? this._data(immutable)
        : this._getSubSnapshot(keyPathToArray(keyPath))._data(immutable);
    } catch(error) {
      if (error instanceof SnapshotNotFoundError) {
        throw new SnapshotNotFoundError(
          "Snapshot with key path " + keyPath + " not found.");
      } else {
        throw error;
      }

    }
  }

  /**
   * Returns the data of the observed object as a JSPO (JavaScript plain
   * object).
   *
   * @param immutable - If this flag is set to true, the data will be returned
   *                    as a immutable JSPO.
   */
  _data(immutable: boolean) {
    let data: any = isArray(this._object) ? [] : {};

    for (let key:string in this._proxy) {
      let subSnapshot = this._mapSubSnapshots.get(key);
      if (subSnapshot === undefined) {
        data[key] = this._object[key];
      } else {
        data[key] = subSnapshot._data(immutable);
      }
      /*
      if (this._mapSubSnapshots.has(key)) {
        data[key] = this._mapSubSnapshots.get(key)._data(immutable);
      } else {
        data[key] = this._object[key];
      }
      */
    }

    return immutable ? Object.freeze(data) : data;
  }

  /**
   * Returns the data of the observed object as an imutable JSPO (JavaScript
   * plain object).
   */
  immutable(keyPath: string) {
    return Object.freeze(this.data(keyPath, true));
  }

  /**
   * Resets the object to the inital state or rather to the state of the last
   * {@link snapshot}.
   */
  reset() {
    this._changed.forEach((value, key) => {
      // $FlowFixMe: Indexable signature not found in ...
      this._proxy[key] = value;
    });

    this._mapSubSnapshots.forEach( (sub) => sub.reset());
  }

  /**
   * Return the observable.
   */
  observable() {
    return this._proxy;
  }

  /**
   * Creates a snapshot and returns a tuple with snapshot and observable.
   */
  static create(object) {
    let snapshot = new ObjectSnapshot(object);
    return [snapshot, snapshot.observable()];
  }

}

export {ObjectSnapshot};
