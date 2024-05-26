import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { useTriggerRender } from "$/lib/utils/trigger-render";
import { createContext, useContext, useEffect } from "react";

export const EditableGridContext = createContext<EditableGridController | null>(
  null,
);

export function useGrid() {
  const triggerRender = useTriggerRender();
  const grid = useContext(EditableGridContext);

  useEffect(() => grid?.subscribe(triggerRender), [grid, triggerRender]);

  // TODO: How do I handle this elegantly?
  if (!grid) throw new Error("EditableGridContext not found");

  return grid;
}

export function useGridCells() {
  const triggerRender = useTriggerRender();
  const grid = useContext(EditableGridContext);

  useEffect(() => grid?.cells.subscribe(triggerRender), [grid, triggerRender]);

  return grid?.getCells() ?? [];
}

export function useGridLines() {
  const triggerRender = useTriggerRender();
  const grid = useContext(EditableGridContext);

  useEffect(() => grid?.lines.subscribe(triggerRender), [grid, triggerRender]);

  return grid?.getLines() ?? { row: [], col: [] };
}
