import { useCallback, useState } from "react";

export function useTriggerRender() {
  const [, _setState] = useState({});
  return useCallback(() => _setState({}), []);
}
