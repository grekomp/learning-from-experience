import { EditableGridCell } from "$/lib/components/editable-grid/editable-grid-cell.component";
import { useGridCells } from "$/lib/components/editable-grid/editable-grid.context";
import { memo } from "react";

export const GridCellsRenderer = memo(function GridCellsRenderer() {
  const cells = useGridCells();

  return (
    <>
      {cells.map((cell, index) => (
        <EditableGridCell key={index} cell={cell} />
      ))}
    </>
  );
});
