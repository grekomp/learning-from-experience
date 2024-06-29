import { EditableGridCell } from "$/lib/components/editable-grid/editable-grid-cell.component";
import { useGridCells } from "$/lib/components/editable-grid/editable-grid.context";
import { AnimatePresence } from "framer-motion";
import { memo } from "react";

export const GridCellsRenderer = memo(function GridCellsRenderer() {
  const cells = useGridCells();

  return (
    <AnimatePresence initial={false}>
      {cells.map((cell) => (
        <EditableGridCell key={cell.id} cell={cell} />
      ))}
    </AnimatePresence>
  );
});
