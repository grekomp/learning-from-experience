"use client";
import "$/app/_components/_suppress-ref-warning";
import { EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { OverlayTargetType } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { EditableGrid } from "$/lib/components/editable-grid/editable-grid.component";
import {
  gridBoundingLines,
  type EditableGridCellData,
} from "$/lib/components/editable-grid/editable-grid.model";
import { CellMergeSplitGripOverlay } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-grip-overlay.component";
import { LineDragOverlay } from "$/lib/components/editable-grid/interactions/line-drag/line-drag-overlay.component";

const colLines = {
  start: {
    name: gridBoundingLines.col.start,
    position: 0,
  },
  mid1: {
    name: "col_mid1",
    position: 0.25,
  },
  mid2: {
    name: "col_mid2",
    position: 0.5,
  },
  mid3: {
    name: "col_mid3",
    position: 0.75,
  },
  end: {
    name: gridBoundingLines.col.end,
    position: 1,
  },
};

const rowLines = {
  start: {
    name: gridBoundingLines.row.start,
    position: 0,
  },
  mid1: {
    name: "row_mid1",
    position: 0.4,
  },
  mid2: {
    name: "row_mid2",
    position: 0.5,
  },
  mid3: {
    name: "row_mid3",
    position: 0.7,
  },
  mid4: {
    name: "row_mid4",
    position: 0.9,
  },
  end: {
    name: gridBoundingLines.row.end,
    position: 1,
  },
};

const initialCells: EditableGridCellData[] = [
  {
    bounds: {
      row: { start: rowLines.start, end: rowLines.mid2 },
      col: { start: colLines.start, end: colLines.mid1 },
    },
    title: "Cell 1",
  },
  {
    bounds: {
      row: { start: rowLines.mid2, end: rowLines.mid4 },
      col: { start: colLines.start, end: colLines.mid1 },
    },
    title: "Cell 2",
  },
  {
    bounds: {
      row: { start: rowLines.mid3, end: rowLines.mid4 },
      col: { start: colLines.mid1, end: colLines.mid3 },
    },
    title: "Cell 6",
  },
  {
    bounds: {
      row: { start: rowLines.start, end: rowLines.mid3 },
      col: { start: colLines.mid1, end: colLines.mid3 },
    },
    title: "Cell 3",
  },
  {
    bounds: {
      row: { start: rowLines.start, end: rowLines.mid1 },
      col: { start: colLines.mid3, end: colLines.end },
    },
    title: "Cell 4",
  },
  {
    bounds: {
      row: { start: rowLines.mid1, end: rowLines.mid4 },
      col: { start: colLines.mid3, end: colLines.end },
    },
    title: "Cell 5",
  },

  {
    bounds: {
      row: { start: rowLines.mid4, end: rowLines.end },
      col: { start: colLines.start, end: colLines.mid2 },
    },
    title: "Cell 7",
  },
  {
    bounds: {
      row: { start: rowLines.mid4, end: rowLines.end },
      col: { start: colLines.mid2, end: colLines.end },
    },
    title: "Cell 8",
  },
];

const gridController = new EditableGridController({
  cells: initialCells,
  lines: {
    col: Object.values(colLines),
    row: Object.values(rowLines),
  },
  overlays: [
    {
      id: crypto.randomUUID(),
      targetType: OverlayTargetType.Lines,
      zIndex: 1,
      component: LineDragOverlay,
    },
    {
      id: crypto.randomUUID(),
      targetType: OverlayTargetType.Cells,
      component: CellMergeSplitGripOverlay,
    },
  ],
});

export default function EditableGridPage() {
  return (
    <div className="flex h-full flex-col content-stretch items-start p-2">
      <EditableGrid grid={gridController} />
    </div>
  );
}
