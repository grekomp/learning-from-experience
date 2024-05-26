import type { EditableGridCellMouseEventData } from "$/lib/components/editable-grid/events/editable-grid-cell-events";
import type { EditableGridLineMouseEventData } from "$/lib/components/editable-grid/events/editable-grid-line-events";
import {
  defineEvent,
  defineEventDictionary,
} from "@grekomp/wonder-event-emitter";

export const gridRowStartLine = "__row-start";
export const gridRowEndLine = "__row-end";
export const gridColStartLine = "__col-start";
export const gridColEndLine = "__col-end";

export const gridBoundingLines = {
  row: {
    start: gridRowStartLine,
    end: gridRowEndLine,
  },
  col: {
    start: gridColStartLine,
    end: gridColEndLine,
  },
};

export const gridLineSnapDistance = 10;
export const gridMinCellWidth = 40;
export const gridMinCellHeight = 40;
export const gridLineKeyboardMoveDistance = 20;
export const gridLineKeyboardMoveDistanceFast = 100;
export const gridLineKeyboardMoveDistanceSlow = 1;

export interface EditableGridCellBounds {
  row: EditableGridCellBoundsAxis;
  col: EditableGridCellBoundsAxis;
}

export interface EditableGridCellBoundsAxis {
  start: EditableGridLine;
  end: EditableGridLine;
}

export interface EditableGridCellData {
  bounds: EditableGridCellBounds;
  title?: string;
  component?: React.Component;
}

export interface EditableGridLine {
  /**
   * Unique identifier of the line.
   */
  name: string;
  /**
   * The position of the line in the grid.
   * Value between 0 (top/left) and 1 (bottom/right).
   */
  position: number;
}

export interface EditableGridLines {
  row: EditableGridLine[];
  col: EditableGridLine[];
}

export interface LineBounds {
  line: EditableGridLine;
  start: EditableGridLine;
  end: EditableGridLine;
}

export enum GridLineAxis {
  Row = "row",
  Col = "col",
}

export interface DraggedLine {
  line: EditableGridLine;
  axis: GridLineAxis;
  startX: number;
  startY: number;
}

export const gridEvents = defineEventDictionary({
  cell: {
    click: defineEvent<EditableGridCellMouseEventData>(),
    mouseEnter: defineEvent<EditableGridCellMouseEventData>(),
    mouseMove: defineEvent<EditableGridCellMouseEventData>(),
    mouseLeave: defineEvent<EditableGridCellMouseEventData>(),
  },
  line: {
    mouseDown: defineEvent<EditableGridLineMouseEventData>(),
    mouseUp: defineEvent<EditableGridLineMouseEventData>(),
  },
  container: {
    mouseDown: defineEvent<MouseEvent>(),
    mouseUp: defineEvent<MouseEvent>(),
    mouseEnter: defineEvent<MouseEvent>(),
    mouseMove: defineEvent<MouseEvent>(),
    mouseLeave: defineEvent<MouseEvent>(),
  },
});
