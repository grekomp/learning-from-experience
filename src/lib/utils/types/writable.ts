/**
 * Removes the readonly modifier from all properties of the given type (non-recursive).
 */
export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};
