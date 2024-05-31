import { useCallback, useState } from "react";

export function useTriggerRender() {
  const [, _setState] = useState(0);
  return useCallback(() => _setState((prev) => prev + 1), []);
}
