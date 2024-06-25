import { type IListenable } from "$/lib/utils/emitter-listenable/listenable";
import { useEffect, useState } from "react";

export function useListenable<ValueType>(
  listenable: IListenable<ValueType>,
  defaultValue: ValueType,
) {
  const [{ value }, setValue] = useState({ value: defaultValue });

  useEffect(() => {
    return listenable.on((value) => setValue({ value }));
  }, [listenable]);

  return value;
}
