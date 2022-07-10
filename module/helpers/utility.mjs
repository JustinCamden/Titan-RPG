export default class TitanUtility {
  // Adds an item to an object, assuming an index from 0 to infinity.
  // Contains checks to make sure it does not overwrite an xisting item
  static pushWithSparseKey(object, item) {
    if (object && item) {
      let idx = 0;
      let key = "0";
      while (object.hasOwnProperty(key)) {
        idx = idx + 1;
        key = idx.toString();
      }

      object[key.toString()] = item;
      return key;
    }
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
