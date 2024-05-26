import type { EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import {
  OverlayTargetType,
  type EditableGridOverlayData,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import {
  type EditableGridCellData,
  type GridLineAxis,
  type gridEvents,
} from "$/lib/components/editable-grid/editable-grid.model";
import { calculateSplitPositionAndAxis } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split.utils";
import type { DataTypeOf } from "@grekomp/wonder-event-emitter";
import { Interaction } from "@grekomp/wonder-interaction-stack";

export interface EditableGridCellMergeDragInteractionData {
  grid: EditableGridController;
  fromCell: EditableGridCellData;
  toCell?: EditableGridCellData;
  startX: number;
  startY: number;
  splitCoords?: {
    axis: GridLineAxis;
    position: number;
  } | null;
}

/**
 * The distance that the mouse has to move from the initial position to start showing the split overlay.
 */
const axisAlignedDistanceThreshold = 20;
const mergeAreaOverlay: EditableGridOverlayData = {
  targetType: OverlayTargetType.Custom,
  component: () => null, // CellMergeDragOverlay,
  zIndex: 20,
  pointerEvents: "none",
};
const cellSplitOverlay: EditableGridOverlayData = {
  targetType: OverlayTargetType.Custom,
  component: () => null, // CellSplitIndicatorOverlay,
  zIndex: 20,
};
const cellsOverlay: EditableGridOverlayData = {
  targetType: OverlayTargetType.Cells,
  component: () => null, // CellMergeCellsOverlay,
  zIndex: 10,
};
const containerOverlay: EditableGridOverlayData = {
  targetType: OverlayTargetType.Container,
  component: null,
};

export class EditableGridCellMergeDragInteraction extends Interaction<EditableGridCellMergeDragInteractionData> {
  setTargetCell = (cell: EditableGridCellData) => {
    if (cell === this.data.fromCell) {
      this.data = { ...this.data, toCell: undefined };
      return;
    }

    this.data = { ...this.data, toCell: cell };
    this.data.grid.removeOverlay(cellSplitOverlay);
  };

  _onStart() {
    this.data.grid.events.cell.mouseEnter.on(this.onCellMouseEnter);
    this.data.grid.events.cell.click.on(this.onCellClick);
    this.data.grid.events.cell.mouseMove.on(this.onCellMouseMove);

    this.data.grid.addOverlay(containerOverlay);
    this.data.grid.addOverlay(cellsOverlay);
    this.data.grid.addOverlay(mergeAreaOverlay);

    this.data = { ...this.data };
  }
  _onComplete() {
    if (!this.data.fromCell) return;

    // If target cell is defined, merge the cells
    if (this.data.toCell) {
      this.data.grid.mergeCells(this.data.fromCell, this.data.toCell);
      return;
    }

    // Otherwise try to split the cell
    if (this.data.splitCoords) {
      this.data.grid.splitCell(
        this.data.fromCell,
        this.data.splitCoords.axis,
        this.data.splitCoords.position,
      );
    }
  }
  _onDispose() {
    this.data.grid.events.cell.mouseEnter.off(this.onCellMouseEnter);
    this.data.grid.events.cell.click.off(this.onCellClick);
    this.data.grid.events.cell.mouseMove.off(this.onCellMouseMove);
    this.data.grid.removeOverlay(containerOverlay);
    this.data.grid.removeOverlay(cellsOverlay);
    this.data.grid.removeOverlay(mergeAreaOverlay);
  }

  onCellMouseEnter = ({
    cell,
  }: DataTypeOf<typeof gridEvents.cell.mouseEnter>) => {
    this.setTargetCell(cell);
  };
  onCellMouseMove = ({
    cell,
    originalEvent,
  }: DataTypeOf<typeof gridEvents.cell.mouseMove>) => {
    if (this.data.fromCell !== cell) return;

    const { startX, startY, grid } = this.data;
    const { clientX, clientY, target } = originalEvent;

    const axisAlignedDistance = Math.max(
      Math.abs(clientX - startX),
      Math.abs(clientY - startY),
    );

    if (axisAlignedDistance < axisAlignedDistanceThreshold) {
      this.data.grid.removeOverlay(cellSplitOverlay);
      this.data = { ...this.data, splitCoords: null };
      return;
    }

    const splitCoords =
      target instanceof HTMLElement
        ? calculateSplitPositionAndAxis({
            startX,
            startY,
            clientX,
            clientY,
            target,
            grid,
            cell,
          })
        : null;

    this.data = { ...this.data, splitCoords };

    if (this.data.grid.getOverlays().includes(cellSplitOverlay)) return;
    this.data.grid.addOverlay(cellSplitOverlay);
  };
  onCellClick = () => {
    this.complete();
  };
}
