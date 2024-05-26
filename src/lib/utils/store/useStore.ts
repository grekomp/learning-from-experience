import { type Store } from "$/lib/utils/store/store.model";
import { useTriggerRender } from "$/lib/utils/trigger-render";
import { useEffect, useRef } from "react";

export function useStore<ValueType>(
  store: Store<ValueType>,
  initialValue: ValueType,
): ValueType {
  const triggerRender = useTriggerRender();
  const valueRef = useRef<ValueType>(initialValue);

  useEffect(
    () =>
      store.subscribe((value) => {
        valueRef.current = value;
        triggerRender();
      }),
    [store, triggerRender],
  );

  return valueRef.current;
}
