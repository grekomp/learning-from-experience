import {
	GridLineAxis,
	gridEndLine,
	gridLineSnapDistance,
	gridMinCellHeight,
	gridMinCellWidth,
	gridStartLine,
	type EditableGridCellBounds,
	type EditableGridCellData,
	type EditableGridLine,
	type EditableGridLineGroups,
	type EditableGridLines,
	type GridLineGroup,
} from '$lib/components/editable-grid/editable-grid.model';
import { isDefined } from '$lib/utils/filter.utils';

export function getCssGridTemplateFromGridLines(gridLines: EditableGridLines): string {
	let rowPositionAccumulator = 0;
	const rows = gridLines.row
		.toSorted((a, b) => a.position - b.position)
		.filter((row) => row.name !== gridStartLine)
		.map((row) => {
			const rowPosition = row.position * 100 - rowPositionAccumulator;
			rowPositionAccumulator += rowPosition;
			return `${rowPosition}% [${row.name}]`;
		})
		.join(' ');

	let colPositionAccumulator = 0;
	const cols = gridLines.col
		.toSorted((a, b) => a.position - b.position)
		.filter((col) => col.name !== gridStartLine)
		.map((col) => {
			const colPosition = col.position * 100 - colPositionAccumulator;
			colPositionAccumulator += colPosition;
			return `${colPosition}% [${col.name}]`;
		})
		.join(' ');

	return `[${gridStartLine}] ${rows} / [${gridStartLine}] ${cols}`;
}

export function getGroupedGridLines(gridLines: EditableGridLines, cells: EditableGridCellData[]) {
	const lineGroups: EditableGridLineGroups = {
		rows: [],
		cols: [],
	};

	cells
		.toSorted((a, b) => a.bounds.row.start.position - b.bounds.row.start.position)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.rows,
				line: cell.bounds.row.start.name,
				crossAxisStart: cell.bounds.col.start,
				crossAxisEnd: cell.bounds.col.end,
			});
		});
	cells
		.toSorted((a, b) => a.bounds.row.end.position - b.bounds.row.end.position)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.rows,
				line: cell.bounds.row.end.name,
				crossAxisStart: cell.bounds.col.start,
				crossAxisEnd: cell.bounds.col.end,
			});
		});
	cells
		.toSorted((a, b) => a.bounds.col.start.position - b.bounds.col.start.position)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.cols,
				line: cell.bounds.col.start.name,
				crossAxisStart: cell.bounds.row.start,
				crossAxisEnd: cell.bounds.row.end,
			});
		});
	cells
		.toSorted((a, b) => a.bounds.col.end.position - b.bounds.col.end.position)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.cols,
				line: cell.bounds.col.end.name,
				crossAxisStart: cell.bounds.row.start,
				crossAxisEnd: cell.bounds.row.end,
			});
		});

	lineGroups.rows = lineGroups.rows.filter(
		(group) => group.name !== gridStartLine && group.name !== gridEndLine,
	);
	lineGroups.cols = lineGroups.cols.filter(
		(group) => group.name !== gridStartLine && group.name !== gridEndLine,
	);

	return lineGroups;
}

export interface AddOrExpandGroupProps {
	groups: GridLineGroup[];
	line: string;
	crossAxisStart: EditableGridLine;
	crossAxisEnd: EditableGridLine;
}
export function addOrExpandGroup({
	groups,
	line,
	crossAxisStart,
	crossAxisEnd,
}: AddOrExpandGroupProps) {
	const matchingGroups = groups.filter((group) => group.name === line);

	if (matchingGroups.length === 0) {
		groups.push({
			name: line,
			start: crossAxisStart,
			end: crossAxisEnd,
		});
		return;
	}

	// Check if an overlapping group already exists
	if (
		matchingGroups.some(
			(group) =>
				group.start.position <= crossAxisStart.position &&
				group.end.position >= crossAxisEnd.position,
		)
	)
		return;

	const expandedGroup = matchingGroups.some((group) => {
		let expandedGroup = false;
		if (
			(group.start === crossAxisEnd || group.start.position < crossAxisEnd.position) &&
			group.start.position > crossAxisStart.position
		) {
			group.start = crossAxisStart;
			expandedGroup = true;
		}
		if (
			(group.end === crossAxisStart || group.end.position > crossAxisStart.position) &&
			group.end.position < crossAxisEnd.position
		) {
			group.end = crossAxisEnd;
			expandedGroup = true;
		}

		if (expandedGroup) return true;
	});

	if (!expandedGroup) {
		groups.push({
			name: line,
			start: crossAxisStart,
			end: crossAxisEnd,
		});
		return;
	}
}

export function calculateRelativePosition(clientX: number, clientY: number, element: HTMLElement) {
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
	const positions = lines.map((line) => line.position).toSorted();
	const closestLine = positions.reduce((closestPosition, line) => {
		if (Math.abs(line - position) < Math.abs(closestPosition - position)) {
			return line;
		}
		return closestPosition;
	}, positions[0]);

	const relativeDistance = Math.abs(closestLine - position);
	const pixelDistance = relativeDistance * containerSize;

	if (pixelDistance < snapDistance) return closestLine;

	return position;
}

export function getContainerSizeInAxis(axis: GridLineAxis, element: HTMLElement) {
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
		(cell) => cell.bounds[axis].start === line || cell.bounds[axis].end === line,
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
		axis === GridLineAxis.Row ? minCellHeight / containerSize : minCellWidth / containerSize;

	return {
		min: Math.max(below + relativeOffset, 0),
		max: Math.min(above - relativeOffset, 1),
	};
}

export interface GetNewCellProps {
	bounds: EditableGridCellBounds;
	splitFrom: EditableGridCellData;
}
export function getNewCell({ bounds, splitFrom }: GetNewCellProps): EditableGridCellData {
	return {
		bounds,
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
			lines.row.filter((line) => line === boundsEntry.row.start || line === boundsEntry.row.end),
		)
		.filter(isDefined);

	const rowStart = rowLines.reduce(
		(acc, line) => {
			if (line.position > acc.position) return acc;

			return line;
		},
		{ name: gridEndLine, position: 1 },
	);
	const rowEnd = rowLines.reduce(
		(acc, line) => {
			if (line.position < acc.position) return acc;

			return line;
		},
		{ name: gridStartLine, position: 0 },
	);

	const colLines = bounds
		.flatMap((boundsEntry) =>
			lines.col.filter((line) => line === boundsEntry.col.start || line === boundsEntry.col.end),
		)
		.filter(isDefined);

	const colStart = colLines.reduce(
		(acc, line) => {
			if (line.position > acc.position) return acc;

			return line;
		},
		{ name: gridEndLine, position: 1 },
	);
	const colEnd = colLines.reduce(
		(acc, line) => {
			if (line.position < acc.position) return acc;

			return line;
		},
		{ name: gridStartLine, position: 0 },
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
