import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { useStore } from "$/lib/utils/store/useStore";
import { useTriggerRender } from "$/lib/utils/trigger-render";
import { createContext, useContext, useEffect, useState } from "react";

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

  if (!grid)
    throw new Error("useGrid was called outside of EditableGridContext");

  return grid;
}

export function useGridCells() {
  const triggerRender = useTriggerRender();
  const grid = useContext(EditableGridContext);

  useEffect(() => grid?.cells.subscribe(triggerRender), [grid, triggerRender]);

  return grid?.getCells() ?? [];
}

export function useGridLines() {
  const grid = useGrid();
  const [lines, setLines] = useState({ ...grid.getLines() });

  useEffect(
    () =>
      grid.lines.subscribe((updatedLines) => {
        setLines({ ...updatedLines });
      }),
    [grid],
  );

  return lines;
}

export function useGridLineNames() {
  const grid = useGrid();
  const [lineNames, setLineNames] = useState([...grid.getAllLineNames()]);

  useEffect(() => {
    return grid.lines.subscribe(() => {
      const updatedLineNames = grid.getAllLineNames();
      if (JSON.stringify(updatedLineNames) === JSON.stringify(lineNames))
        return;

      setLineNames([...updatedLineNames]);
    });
  }, [grid, lineNames]);

  return lineNames;
}

export function useGridOverlays() {
  const grid = useGrid();

  return useStore(grid.overlays, grid.getOverlays());
}
