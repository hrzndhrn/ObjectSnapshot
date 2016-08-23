// @flow

/**
 * @module ObjectSnapshot.util
 * @author Marcus Kruse <marcus.kruse@vivai.de>
 */

import {customError} from "jsz-error";
import {isEmptyString} from "jsz-string";

/**
 * A custom error class for undiscoverable snapshots.
 */
const SnapshotNotFoundError = customError(
  "SnapshotNotFoundError", "Snapshot not found!");

/**
 * A util function to transform a key path string in an array of keys.
 *
 * @example
 * keyPathToArray("key.path.to.array");
 * // returns ["key", "path", "to", "array"]
 */
const keyPathToArray = (keyPath: string): Array<string> =>
  isEmptyString(keyPath) ? [] : keyPath.split(".");

function mapGetOr(aMap: Map<string,any>, key: string, defaultValue:any):any {
  let value = aMap.get(key);
  if (value === undefined) {
    value = defaultValue;
  }

  return value;
}

/**
 * Regular expression to test if a string represents an integer.
 */
const isInt = /^-?\d+$/;

/**
 * A constant for indicate a missing length attribute.
 */
const NO_LENGTH: number = -1;

export {
  SnapshotNotFoundError,
  keyPathToArray,
  mapGetOr,
  isInt,
  NO_LENGTH
};
