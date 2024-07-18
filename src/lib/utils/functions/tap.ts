/**
 * Returns a function that calls the given function with the argument and returns the argument.
 * This is useful in pipe/flow functions where you want to use the value without consuming it.
 */
export function tap<InType>(
  fn: (fnArg: InType) => unknown,
): (fnArg: InType) => InType {
  return (a) => {
    fn(a);
    return a;
  };
}
