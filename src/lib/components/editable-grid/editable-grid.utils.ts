import {
  GridLineAxis,
  gridBoundingLines,
  gridLineSnapDistance,
  gridMinCellHeight,
  gridMinCellWidth,
  type EditableGridCellBounds,
  type EditableGridCellData,
  type EditableGridLine,
  type EditableGridLineId,
  type EditableGridLines,
} from "$/lib/components/editable-grid/editable-grid.model";
import { isDefined } from "$/lib/utils/filter.utils";
import { uuid } from "$/lib/utils/uuid";

export function getCssGridTemplateFromGridLines(
  gridLines: EditableGridLines,
): string {
  let rowPositionAccumulator = 0;
  const rows = [...gridLines.row]
    .sort((a, b) => a.position - b.position)
    .filter((row) => row.name !== gridBoundingLines.row.start)
    .map((row) => {
      const rowPosition = row.position * 100 - rowPositionAccumulator;
      rowPositionAccumulator += rowPosition;
      return `${rowPosition}% [${row.name}]`;
    })
    .join(" ");

  let colPositionAccumulator = 0;
  const cols = [...gridLines.col]
    .sort((a, b) => a.position - b.position)
    .filter((col) => col.name !== gridBoundingLines.col.start)
    .map((col) => {
      const colPosition = col.position * 100 - colPositionAccumulator;
      colPositionAccumulator += colPosition;
      return `${colPosition}% [${col.name}]`;
    })
    .join(" ");

  return `[${gridBoundingLines.row.start}] ${rows} / [${gridBoundingLines.col.start}] ${cols}`;
}

export function calculateRelativePosition(
  clientX: number,
  clientY: number,
  element: HTMLElement,
) {
  const rect = element.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const relativeX = x / rect.width;
  const relativeY = y / rect.height;

  return { x: relativeX, y: relativeY };
}

export function snapLinePosition(
  position: number,
  lines: EditableGridLine[],
  containerSize: number,
  snapDistance: number = gridLineSnapDistance,
) {
  const positions = lines.map((line) => line.position).sort();
  const closestLine = positions.reduce((closestPosition, line) => {
    if (Math.abs(line - position) < Math.abs(closestPosition - position)) {
      return line;
    }
    return closestPosition;
  }, positions[0] ?? 0);

  const relativeDistance = Math.abs(closestLine - position);
  const pixelDistance = relativeDistance * containerSize;

  if (pixelDistance < snapDistance) return closestLine;

  return position;
}

export function getContainerSizeInAxis(
  axis: GridLineAxis,
  element: HTMLElement,
) {
  return axis === GridLineAxis.Row ? element.clientHeight : element.clientWidth;
}

export interface GetMinMaxValidLinePositionProps {
  line: EditableGridLine;
  axis: GridLineAxis;
  lines: EditableGridLines;
  cells: readonly EditableGridCellData[];
  gridContainer: HTMLElement;
  minCellWidth?: number;
  minCellHeight?: number;
}
export function getMinMaxValidLinePosition({
  line,
  axis,
  cells,
  gridContainer,
  minCellWidth = gridMinCellWidth,
  minCellHeight = gridMinCellHeight,
}: GetMinMaxValidLinePositionProps) {
  // find cells that use the line
  const neighboringCells = cells.filter(
    (cell) =>
      cell.bounds[axis].start === line || cell.bounds[axis].end === line,
  );

  const linePosition = line.position;
  const neighboringLinesPositions = [
    ...new Set(
      neighboringCells.map((cell) => {
        if (cell.bounds[axis].start === line) {
          return cell.bounds[axis].end;
        }

        return cell.bounds[axis].start;
      }),
    ),
  ].map((line) => line.position);

  const { below, above } = neighboringLinesPositions.reduce(
    (acc, neighboringLinePosition) => ({
      below:
        neighboringLinePosition < linePosition
          ? Math.max(neighboringLinePosition, acc.below)
          : acc.below,
      above:
        neighboringLinePosition > linePosition
          ? Math.min(neighboringLinePosition, acc.above)
          : acc.above,
    }),
    { below: 0, above: 1 },
  );

  const containerSize = getContainerSizeInAxis(axis, gridContainer);
  const relativeOffset =
    axis === GridLineAxis.Row
      ? minCellHeight / containerSize
      : minCellWidth / containerSize;

  return {
    min: Math.max(below + relativeOffset, 0),
    max: Math.min(above - relativeOffset, 1),
  };
}

export interface GetMinMaxValidCellSplitPositionProps {
  gridContainer: HTMLElement;
  cell: EditableGridCellData;
  axis: GridLineAxis;
  minCellWidth?: number;
  minCellHeight?: number;
}
export function getMinMaxValidCellSplitPosition({
  gridContainer,
  cell,
  axis,
  minCellWidth = gridMinCellWidth,
  minCellHeight = gridMinCellHeight,
}: GetMinMaxValidCellSplitPositionProps) {
  const cellStartPosition = cell.bounds[axis].start.position;
  const cellEndPosition = cell.bounds[axis].end.position;

  const minCellSize = axis === GridLineAxis.Row ? minCellHeight : minCellWidth;
  const containerSize = getContainerSizeInAxis(axis, gridContainer);

  const relativeOffset = minCellSize / containerSize;
  return {
    min: Math.max(cellStartPosition + relativeOffset, 0),
    max: Math.min(cellEndPosition - relativeOffset, 1),
  };
}

export interface GetNewCellProps {
  bounds: EditableGridCellBounds;
  splitFrom: EditableGridCellData;
}
export function getNewCell({
  bounds,
  splitFrom,
}: GetNewCellProps): EditableGridCellData {
  return {
    id: uuid(),
    bounds,
    component: splitFrom.component,
    title: `Split from ${splitFrom.title}`,
  };
}

export interface GetNewLinePositionProps {
  requestedPosition: number;
  line: EditableGridLine;
  axis: GridLineAxis;
  lines: EditableGridLines;
  cells: readonly EditableGridCellData[];
  gridContainer: HTMLElement;
  minCellWidth?: number;
  minCellHeight?: number;
}
export function getNewLinePosition({
  requestedPosition,
  line,
  axis,
  lines,
  cells,
  gridContainer,
  minCellWidth,
  minCellHeight,
}: GetNewLinePositionProps) {
  const linesMatchingAxisExceptMovedLine = lines[axis].filter(
    (otherLine) => otherLine.name !== line.name,
  );

  const snappedPosition = snapLinePosition(
    requestedPosition,
    linesMatchingAxisExceptMovedLine,
    getContainerSizeInAxis(axis, gridContainer),
  );

  const { min, max } = getMinMaxValidLinePosition({
    line,
    axis,
    cells,
    gridContainer,
    lines,
    minCellWidth,
    minCellHeight,
  });

  const clampedPosition = Math.max(min, Math.min(max, snappedPosition));

  return clampedPosition;
}

export function invertAxis(axis: GridLineAxis) {
  return axis === GridLineAxis.Row ? GridLineAxis.Col : GridLineAxis.Row;
}

export function getOuterBounds(
  bounds: EditableGridCellBounds[],
  lines: EditableGridLines,
): EditableGridCellBounds {
  const rowLines = bounds
    .flatMap((boundsEntry) =>
      lines.row.filter(
        (line) =>
          line === boundsEntry.row.start || line === boundsEntry.row.end,
      ),
    )
    .filter(isDefined);

  const rowStart = rowLines.reduce(
    (acc, line) => {
      if (line.position > acc.position) return acc;

      return line;
    },
    { name: gridBoundingLines.row.end, position: 1 },
  );
  const rowEnd = rowLines.reduce(
    (acc, line) => {
      if (line.position < acc.position) return acc;

      return line;
    },
    { name: gridBoundingLines.row.start, position: 0 },
  );

  const colLines = bounds
    .flatMap((boundsEntry) =>
      lines.col.filter(
        (line) =>
          line === boundsEntry.col.start || line === boundsEntry.col.end,
      ),
    )
    .filter(isDefined);

  const colStart = colLines.reduce(
    (acc, line) => {
      if (line.position > acc.position) return acc;

      return line;
    },
    { name: gridBoundingLines.col.end, position: 1 },
  );
  const colEnd = colLines.reduce(
    (acc, line) => {
      if (line.position < acc.position) return acc;

      return line;
    },
    { name: gridBoundingLines.col.start, position: 0 },
  );

  return {
    row: {
      start: rowStart,
      end: rowEnd,
    },
    col: {
      start: colStart,
      end: colEnd,
    },
  };
}

/**
 * Returns true if the line is not a grid start or end line.
 */
export function isMiddleGridLine(line: EditableGridLine) {
  return isMiddleGridLineName(line.name);
}
export function isMiddleGridLineName(lineName: EditableGridLineId) {
  return (
    lineName !== gridBoundingLines.row.start &&
    lineName !== gridBoundingLines.row.end &&
    lineName !== gridBoundingLines.col.start &&
    lineName !== gridBoundingLines.col.end
  );
}
