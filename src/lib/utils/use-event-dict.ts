import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;
type FunctionValues<T extends object> = {
  [Key in keyof T]: T[Key] extends AnyFunction ? T[Key] : never;
};

/**
 * Memoizes functions in an object and returns a new object with the memoized functions.
 */
export function useEventDict<Handlers extends object>(
  handlers: FunctionValues<Handlers>,
): FunctionValues<Handlers> {
  const currentHandlersRef = useRef(handlers);
  currentHandlersRef.current = handlers;

  const memoizedHandlersRef = useRef<
    Partial<Record<keyof Handlers, AnyFunction>>
  >({});

  Object.keys(handlers).forEach((key) => {
    // Delete any non-function keys
    if (typeof handlers[key as keyof Handlers] !== "function") {
      delete memoizedHandlersRef.current[key as keyof Handlers];
      return;
    }

    // Skip existing keys
    if (key in memoizedHandlersRef.current) return;

    // Add new memoized handler
    memoizedHandlersRef.current[key as keyof Handlers] = (
      ...args: unknown[]
    ) => {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-return*/
      return currentHandlersRef.current[key as keyof Handlers]?.(...args);
    };
  });

  // Remove memoized handlers that were removed from the handlers object
  Object.keys(memoizedHandlersRef.current).forEach((key) => {
    if (key in handlers) return;

    delete memoizedHandlersRef.current[key as keyof Handlers];
  });

  return memoizedHandlersRef.current as FunctionValues<Handlers>;
}
