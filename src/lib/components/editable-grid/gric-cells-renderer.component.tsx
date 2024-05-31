import { EditableGridCell } from "$/lib/components/editable-grid/editable-grid-cell.component";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { memo } from "react";

export const GridCellsRenderer = memo(function GridCellsRenderer() {
  const grid = useGrid();

  return (
    <>
      {grid.getCells().map((cell, index) => (
        <EditableGridCell key={index} cell={cell} />
      ))}
    </>
  );
});
