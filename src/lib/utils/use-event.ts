import { useCallback, useRef } from "react";

/**
 * Returns a memoized function that doesn't require passing dependencies.
 * The returned function always maintains a stable reference.
 * The {@link callback} always uses the newest version, to keep closures fresh.
 *
 * @param callback Function to be called when the event is called.
 * @returns An always-stable always-fresh version of the callback.
 */
// using `any` here as correct types are inferred from usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEvent<T extends (...args: any[]) => any>(
  callback: T | undefined,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const callbackProxy = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (...args: Parameters<T>): ReturnType<T> => callbackRef.current?.(...args),
    [],
  );

  return callbackProxy;
}
