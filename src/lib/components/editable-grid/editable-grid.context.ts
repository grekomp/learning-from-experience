import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { useTriggerRender } from "$/lib/utils/trigger-render";
import { createContext, useContext, useEffect } from "react";

export const EditableGridContext = createContext<EditableGridController | null>(
  null,
);

export interface UseGridProps {
  /**
   * If true, the component will re-render when the grid data (cells, lines) changes.
   *
   * @default false
   */
  subscribe?: boolean;
}
export function useGrid({ subscribe = false }: UseGridProps = {}) {
  const triggerRender = useTriggerRender();
  const grid = useContext(EditableGridContext);

  useEffect(() => {
    if (subscribe) return grid?.subscribe(triggerRender);
  }, [grid, triggerRender, subscribe]);

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
