/**
 * Returns all elements of an array after the first element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tail<T extends any[]> = T extends [any, ...infer U] ? U : never;
