// @flow

/**
 * @module ObjectSnapshot.proxify
 */

import {isObject, isArray} from "jsz-isType";
import {ObjectSnapshot} from "./ObjectSnapshot";
import {
  mapGetOr,
  isInt,
  NO_LENGTH
} from "./util";

/**
 * This closure creates the proxy for the object.
 */
function proxify<T:Object>(object: T, snapshot: ObjectSnapshot): Proxy<T> {

  /**
   * The getter for the proxy.
   */
  function get(target: T, key: string): any {
    let subSnapshot = snapshot._mapSubSnapshots.get(key),
        value: any;

    if (subSnapshot === undefined) {
      value = target[key];
    } else {
      value =  subSnapshot.observable();
    }

    return value;
  }

  /**
   * The setter for the proxy when the object is an object and not an array.
   */
  function setObject(target: T,key: string, value: any): any {
    let oldValue = target[key];
    let subSnapshot = snapshot._mapSubSnapshots.get(key);

    if (subSnapshot === undefined) {
      if (oldValue !== value) {
        if (snapshot._changed.has(key)) {
          if (snapshot._changed.get(key) === value) {
            snapshot._changed.delete(key);
          }
        } else {
          snapshot._changed.set(key, oldValue);
        }
      }

      return setValue(target, key, value);
    } else {
      for (let key in value) {
        // $FlowFixMe: Indexable signature not found in ...
        subSnapshot._proxy[key] = value[key];
      }
      if(isArray(value)) {
        if ( oldValue.length > value.length) {
          // @todo: Refactoring?
          let diff = oldValue.length - value.length;
          for (diff; diff > 0; diff--) {
            // $FlowFixMe: Property not found in ...
            subSnapshot._proxy.pop();
          }
        } else {
          // $FlowFixMe: Property not found in ...
          subSnapshot._proxy.length = value.length;
        }

      }
    }

    return true;
  }

  /**
   * The setter for the proxy when the object is an object and not an array.
   */
  function setArray(target, key, value) {
    let oldValue = target[key];
    let length = snapshot._initialArrayLength;
    let subSnapshot = snapshot._mapSubSnapshots.get(key);
    let outOfRange = isInt.test(key) && parseInt(key, 10) >= length;

    if (key === "length") {
      if (value === length) {
        snapshot._changed.delete("length");
      } else {
        snapshot._changed.set("length", length);
      }

      if (snapshot._changed.has("length")
          && snapshot._changed.get("length") === value) {
        snapshot._changed.delete("length");
      }

      setValue(target, key, value);
    } else {
      if (subSnapshot === undefined) {
        if (!outOfRange && oldValue !== value) {
          if (snapshot._changed.has(key)) {
            if (snapshot._changed.get(key) === value) {
              snapshot._changed.delete(key);
            }
          } else {
            snapshot._changed.set(key, oldValue);
          }
        }
      }

      setValue(target, key, value);
    }

    // return setValue(target, key, value);
    return true;
  }

  /**
   * A helper function for the setter {@ling setObject} and {@ling setArray}.
   */
  function setValue(target, key, value) {
    let objectSnapshot = null;
    let subSnapshot = snapshot._mapSubSnapshots.get(key);

    if (subSnapshot === undefined) {
      if (isArray(value) || isObject(value)) {
        objectSnapshot = new ObjectSnapshot(value);
      }

      if (objectSnapshot !== null) {
        snapshot._mapSubSnapshots.set(key, objectSnapshot);
      }

      target[key] = value;
    } else {
      for (let key in value) {
        // $FlowFixMe: Indexable signature not found in ...
        subSnapshot._proxy[key] = value[key];
      }
    }

    return true;
  }

  /**
   * A handler for deleteProperty trap.
   */
  function deletePropertyArray(target, key) {
    let oldValue = target[key];
    let length = mapGetOr(snapshot._changed, "length", NO_LENGTH);
    let outOfRange = length >= 0 && key >= length;

    if (!snapshot._changed.has(key) && !outOfRange) {
      snapshot._changed.set(key, oldValue);
    }

    return true;
  }

  function deletePropertyObject(target, key) {
    // @todo: implement
    return true;
  }

  // Create the proxy.
  let proxy: Proxy<T>;

  if (isArray(object)) {
    // Save initial length of the array.
    snapshot._initialArrayLength = object.length;
    proxy = new Proxy(object, {
      get:get, set:setArray, deleteProperty:deletePropertyArray
    });
  } else {
    proxy = new Proxy(object, {
      get:get, set:setObject, deleteProperty: deletePropertyObject
    });
  }

  return proxy;
}

export {proxify}
