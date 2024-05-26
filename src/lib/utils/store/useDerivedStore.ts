import { useTriggerRender } from "$/lib/utils/trigger-render";
import { useEffect, useRef } from "react";

export type UseDerivedStoreCallback = () => void;

export function useDerivedStore<DataType, ResultType>(parent: Store<DataType>, callback: UseDerivedStoreCallback, initialValue: ResultType) {
    const triggerRender = useTriggerRender();
    const valueRef = useRef(initialValue);
    
  useEffect(() => {

    const deriveValue = ()
    

        const unsubscribeFns = stores.map(store => store.subscribe(() => {
            const storeValues = stores.map(store => store.getValue());
            const newValue = fn(...storeValues);
            if (newValue !== derivedValue) {
                derivedValue = newValue;
                triggerRender();
            }
        }));
        return () => {
            unsubscribeFns.forEach(fn => fn());
        };
    }, [stores, triggerRender]);
    return derivedValue;
}