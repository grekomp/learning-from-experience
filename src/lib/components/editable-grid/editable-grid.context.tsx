import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { useListenable } from "$/lib/utils/emitter-listenable/use-listenable";
import { useTriggerRender } from "$/lib/utils/trigger-render";
import { createContext, useContext, useEffect, useMemo } from "react";

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
    if (subscribe) return grid?.onChange.on(triggerRender);
  }, [grid, triggerRender, subscribe]);

  if (!grid)
    throw new Error("useGrid was called outside of EditableGridContext");

  return grid;
}

export function useGridCells() {
  const grid = useGrid();
  return useListenable(grid.onCellsChange, grid.getCells());
}

export function useGridLines() {
  const grid = useGrid();
  return useListenable(grid.onLinesChange, grid.getLines());
}

export function useGridLineNames() {
  const grid = useGrid();
  const lines = useGridLines();

  const lineNames = useMemo(() => {
    lines;
    return grid.getAllLineNames();
  }, [grid, lines]);

  return lineNames;
}

export function useGridOverlays() {
  const grid = useGrid();
  return useListenable(grid.onOverlaysChange, grid.getOverlays());
}
