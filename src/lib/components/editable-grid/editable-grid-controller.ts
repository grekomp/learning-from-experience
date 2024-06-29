import type { EditableGridOverlayData } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import {
  GridLineAxis,
  gridBoundingLines,
  gridEvents,
  type EditableGridCellBounds,
  type EditableGridCellData,
  type EditableGridLine,
  type EditableGridLines,
  type LineBounds,
} from "$/lib/components/editable-grid/editable-grid.model";
import {
  getNewCell,
  invertAxis,
} from "$/lib/components/editable-grid/editable-grid.utils";
import { Emitter } from "$/lib/utils/emitter-listenable/emitter";
import { Listenable } from "$/lib/utils/emitter-listenable/listenable";
import {
  WonderEventEmitter,
  bindEventDictionary,
  type BoundEventDictionaryFor,
} from "@grekomp/wonder-event-emitter";
import { InteractionStack } from "@grekomp/wonder-interaction-stack";

export class EditableGridController {
  private __lines: EditableGridLines;
  private __onLinesChange = new Emitter<Readonly<EditableGridLines>>();
  readonly onLinesChange = new Listenable(this.__onLinesChange);
  getLines(): Readonly<EditableGridLines> {
    return this.__lines;
  }
  getAllLineNames(): string[] {
    return [...this.__lines.col, ...this.__lines.row].map((line) => line.name);
  }

  private __cells: EditableGridCellData[];
  private __onCellsChange = new Emitter<Readonly<EditableGridCellData[]>>();
  readonly onCellsChange = new Listenable(this.__onCellsChange);
  getCells(): Readonly<EditableGridCellData[]> {
    return this.__cells;
  }

  private __overlays: EditableGridOverlayData[];
  private __onOverlaysChange = new Emitter<
    Readonly<EditableGridOverlayData[]>
  >();
  readonly onOverlaysChange = new Listenable(this.__onOverlaysChange);
  getOverlays(): Readonly<EditableGridOverlayData[]> {
    return this.__overlays;
  }

  private __onChange = new Emitter<EditableGridController>();
  readonly onChange = new Listenable(this.__onChange);

  gridContainer: HTMLElement | null = null;
  setContainer = (element: HTMLElement | null) => {
    this.gridContainer = element;
  };
  events: BoundEventDictionaryFor<typeof gridEvents>;
  eventEmitter: WonderEventEmitter;
  interactionStack: InteractionStack;

  constructor({
    lines,
    cells,
    overlays = [],
    eventEmitter = new WonderEventEmitter(),
    interactionStack = new InteractionStack(),
  }: {
    lines: EditableGridLines;
    cells: EditableGridCellData[];
    overlays?: EditableGridOverlayData[];
    eventEmitter?: WonderEventEmitter;
    interactionStack?: InteractionStack;
  }) {
    this.__lines = lines;
    this.__cells = cells;
    this.__overlays = overlays;

    this.eventEmitter = eventEmitter;
    this.interactionStack = interactionStack;
    this.events = bindEventDictionary(gridEvents, this.eventEmitter);
  }

  // #region Managing lines
  findLine(lineName: string) {
    return (
      this.__lines.col.find((line) => line.name === lineName) ??
      this.__lines.row.find((line) => line.name === lineName)
    );
  }
  findLineAxis(line: EditableGridLine): GridLineAxis | null {
    if (this.__lines.row.includes(line)) return GridLineAxis.Row;
    if (this.__lines.col.includes(line)) return GridLineAxis.Col;
    return null;
  }
  replaceLineInCells(
    lineToReplace: EditableGridLine,
    newLine: EditableGridLine,
  ) {
    this.__cells.forEach((cell) => {
      if (cell.bounds.row.start === lineToReplace)
        cell.bounds.row.start = newLine;
      if (cell.bounds.row.end === lineToReplace) cell.bounds.row.end = newLine;
      if (cell.bounds.col.start === lineToReplace)
        cell.bounds.col.start = newLine;
      if (cell.bounds.col.end === lineToReplace) cell.bounds.col.end = newLine;
    });
  }
  removeUnusedLines() {
    this.__lines.row = this.__lines.row.filter((line) => {
      return this.__cells.some(
        (cell) =>
          cell.bounds.row.start === line || cell.bounds.row.end === line,
      );
    });
    this.__lines.col = this.__lines.col.filter((line) => {
      return this.__cells.some(
        (cell) =>
          cell.bounds.col.start === line || cell.bounds.col.end === line,
      );
    });
  }
  areLinesAligned(line1: EditableGridLine, line2: EditableGridLine) {
    return Math.abs(line1.position - line2.position) < 0.00001;
  }
  moveLine(line: EditableGridLine, newPosition: number) {
    line.position = newPosition;
    this.__lines = { ...this.__lines };
    this.__onLinesChange.emit(this.__lines);
    this.__onChange.emit(this);
  }
  getLineBounds(line: EditableGridLine): LineBounds | null {
    const lineAxis = this.findLineAxis(line);
    if (!lineAxis) return null;

    const inverseAxis = invertAxis(lineAxis);
    const inverseAxisStartLine = this.findLine(
      gridBoundingLines[inverseAxis].start,
    );
    const inverseAxisEndLine = this.findLine(
      gridBoundingLines[inverseAxis].end,
    );

    if (!inverseAxisStartLine || !inverseAxisEndLine) return null;

    const { start, end } = this.__cells.reduce(
      ({ start, end }, cell) => {
        if (
          cell.bounds[lineAxis].start !== line &&
          cell.bounds[lineAxis].end !== line
        )
          return { start, end };

        const cellStart = cell.bounds[inverseAxis].start;
        const cellEnd = cell.bounds[inverseAxis].end;

        return {
          start: start.position < cellStart.position ? start : cellStart,
          end: end.position > cellEnd.position ? end : cellEnd,
        };
      },
      {
        start: inverseAxisEndLine,
        end: inverseAxisStartLine,
      },
    );

    return {
      line,
      start: start.name,
      end: end.name,
    };
  }
  // #endregion Managing lines

  // #region Managing cells
  expandCell(cell: EditableGridCellData, toLine: EditableGridLine) {
    const axis = this.findLineAxis(toLine);
    if (!axis) return;

    if (cell.bounds[axis].start.position > toLine.position)
      cell.bounds[axis].start = toLine;
    if (cell.bounds[axis].end.position < toLine.position)
      cell.bounds[axis].end = toLine;
  }

  /**
   * Returns true, if cell1 is above/to the left of cell2 in the given axis.
   */
  areCellsSorted(
    cell1: EditableGridCellData,
    cell2: EditableGridCellData,
    axis: GridLineAxis,
  ) {
    const inverseAxis = invertAxis(axis);
    return (
      cell1.bounds[inverseAxis].start.position <
      cell2.bounds[inverseAxis].start.position
    );
  }

  areCellsAlignedInAxis(
    cell1: EditableGridCellData,
    cell2: EditableGridCellData,
    axis: GridLineAxis,
  ) {
    const cell1StartLine = cell1.bounds[axis].start;
    const cell2StartLine = cell2.bounds[axis].start;
    const cell1EndLine = cell1.bounds[axis].end;
    const cell2EndLine = cell2.bounds[axis].end;

    if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine)
      return false;

    return (
      this.areLinesAligned(cell1StartLine, cell2StartLine) &&
      this.areLinesAligned(cell1EndLine, cell2EndLine)
    );
  }
  /**
   * Cells are considered perfectly aligned in a axis, if they share the start and end lines in that axis.
   */
  areCellsAlignedPerfectlyInAxis(
    cell1: EditableGridCellData,
    cell2: EditableGridCellData,
    axis: GridLineAxis,
  ) {
    const cell1StartLine = cell1.bounds[axis].start;
    const cell2StartLine = cell2.bounds[axis].start;
    const cell1EndLine = cell1.bounds[axis].end;
    const cell2EndLine = cell2.bounds[axis].end;
    if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine)
      return false;

    return cell1StartLine === cell2StartLine && cell1EndLine === cell2EndLine;
  }
  areCellsNeighborsInAxis(
    cell1: EditableGridCellData,
    cell2: EditableGridCellData,
    axis: GridLineAxis,
  ) {
    const inverseAxis = invertAxis(axis);
    const cell1StartLine = cell1.bounds[inverseAxis].start;
    const cell2StartLine = cell2.bounds[inverseAxis].start;
    const cell1EndLine = cell1.bounds[inverseAxis].end;
    const cell2EndLine = cell2.bounds[inverseAxis].end;

    if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine)
      return false;
    if (cell1StartLine === cell2EndLine || cell1EndLine === cell2StartLine)
      return true;

    return false;
  }

  // #region Splitting and merging cells
  splitCell(
    cell: EditableGridCellData,
    axis: GridLineAxis,
    relativeSplitPosition = 0.5,
  ) {
    const newLineName = `mid-${crypto.randomUUID()}`;

    const startLine = cell.bounds[axis].start;
    const endLine = cell.bounds[axis].end;

    if (!startLine || !endLine) return;

    const newLinePosition =
      startLine.position +
      (endLine.position - startLine.position) * relativeSplitPosition;

    const newLine = {
      name: newLineName,
      position: newLinePosition,
    };
    this.__lines[axis].push(newLine);

    const newCellBounds: EditableGridCellBounds = {
      row: { start: cell.bounds.row.start, end: cell.bounds.row.end },
      col: { start: cell.bounds.col.start, end: cell.bounds.col.end },
    };
    newCellBounds[axis].start = newLine;

    cell.bounds[axis].end = newLine;

    const newCell = getNewCell({ bounds: newCellBounds, splitFrom: cell });
    this.__cells.push(newCell);

    this.__lines = { ...this.__lines };
    this.__onLinesChange.emit(this.__lines);
    this.__cells = [...this.__cells];
    this.__onCellsChange.emit(this.__cells);
    this.__onChange.emit(this);
  }

  canMergeCells(
    source: EditableGridCellData,
    target: EditableGridCellData,
  ): boolean {
    return !!this.findValidCellsMergeAxis(source, target);
  }

  findValidCellsMergeAxis(
    source: EditableGridCellData,
    target: EditableGridCellData,
  ): GridLineAxis | false {
    let alignedAxis: GridLineAxis | null = null;

    if (this.areCellsAlignedInAxis(source, target, GridLineAxis.Row))
      alignedAxis = GridLineAxis.Row;
    if (this.areCellsAlignedInAxis(source, target, GridLineAxis.Col))
      alignedAxis = GridLineAxis.Col;

    if (!alignedAxis) return false;
    if (!this.areCellsNeighborsInAxis(source, target, alignedAxis))
      return false;

    return alignedAxis;
  }

  mergeCells(source: EditableGridCellData, target: EditableGridCellData) {
    if (source === target) return;

    const axis = this.findValidCellsMergeAxis(source, target);

    if (!axis) return;

    if (!this.areCellsAlignedPerfectlyInAxis(source, target, axis)) {
      this.replaceLineInCells(
        target.bounds[axis].start,
        source.bounds[axis].start,
      );
      this.replaceLineInCells(target.bounds[axis].end, source.bounds[axis].end);
    }

    // Extend the source cell bounds to cover target
    const inverseAxis = invertAxis(axis);
    if (source.bounds[inverseAxis].end === target.bounds[inverseAxis].start)
      source.bounds[inverseAxis].end = target.bounds[inverseAxis].end;
    if (source.bounds[inverseAxis].start === target.bounds[inverseAxis].end)
      source.bounds[inverseAxis].start = target.bounds[inverseAxis].start;

    // Remove target
    // TODO: Destroy the target component and cleanup
    this.__cells = this.__cells.filter((cell) => cell !== target);

    this.__lines = { ...this.__lines };
    this.__onLinesChange.emit(this.__lines);
    this.__cells = [...this.__cells];
    this.__onCellsChange.emit(this.__cells);
    this.__onChange.emit(this);

    // Delay removing the unused lines to  allow components to be animated out
    requestAnimationFrame(() => {
      this.removeUnusedLines();
      this.__lines = { ...this.__lines };
      this.__onLinesChange.emit(this.__lines);
    });
  }
  // #endregion Splitting and merging cells
  // #endregion Managing cells

  // #region Managing overlays
  addOverlay(overlay: EditableGridOverlayData) {
    this.__overlays = [...this.__overlays, overlay];
    this.__onOverlaysChange.emit(this.__overlays);
    this.__onChange.emit(this);
  }
  removeOverlay(overlay: EditableGridOverlayData | undefined) {
    if (!overlay) return;
    this.__overlays = this.__overlays.filter((o) => o !== overlay);
    this.__onOverlaysChange.emit(this.__overlays);
    this.__onChange.emit(this);
  }
  // #endregion Managing overlays
}
