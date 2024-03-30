import {
	GridLineDirection,
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

export function getGridTemplate(gridLines: EditableGridLines): string {
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

function getLinePosition(lines: EditableGridLine[], line: string) {
	return lines.find((linesEl) => linesEl.name === line)?.position;
}

export function getGroupedGridLines(gridLines: EditableGridLines, cells: EditableGridCellData[]) {
	const lineGroups: EditableGridLineGroups = {
		rows: [],
		cols: [],
	};

	const cellsWithBoundsPositions = cells.map((cell) => ({
		...cell,
		positions: {
			row: {
				start: getLinePosition(gridLines.row, cell.bounds.row.start) ?? 0,
				end: getLinePosition(gridLines.row, cell.bounds.row.end) ?? 0,
			},
			col: {
				start: getLinePosition(gridLines.col, cell.bounds.col.start) ?? 0,
				end: getLinePosition(gridLines.col, cell.bounds.col.end) ?? 0,
			},
		},
	}));

	cellsWithBoundsPositions
		.toSorted((a, b) => a.positions.row.start - b.positions.row.start)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.rows,
				crossAxisLines: gridLines.col,
				line: cell.bounds.row.start,
				crossAxisStart: cell.bounds.col.start,
				crossAxisEnd: cell.bounds.col.end,
			});
		});
	cellsWithBoundsPositions
		.toSorted((a, b) => a.positions.row.end - b.positions.row.end)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.rows,
				crossAxisLines: gridLines.col,
				line: cell.bounds.row.end,
				crossAxisStart: cell.bounds.col.start,
				crossAxisEnd: cell.bounds.col.end,
			});
		});
	cellsWithBoundsPositions
		.toSorted((a, b) => a.positions.col.start - b.positions.col.start)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.cols,
				crossAxisLines: gridLines.row,
				line: cell.bounds.col.start,
				crossAxisStart: cell.bounds.row.start,
				crossAxisEnd: cell.bounds.row.end,
			});
		});
	cellsWithBoundsPositions
		.toSorted((a, b) => a.positions.col.end - b.positions.col.end)
		.forEach((cell) => {
			addOrExpandGroup({
				groups: lineGroups.cols,
				crossAxisLines: gridLines.row,
				line: cell.bounds.col.end,
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
	crossAxisLines: EditableGridLine[];
	line: string;
	crossAxisStart: string;
	crossAxisEnd: string;
}
export function addOrExpandGroup({
	groups,
	crossAxisLines,
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

	const crossAxisStartPosition = getLinePosition(crossAxisLines, crossAxisStart) ?? 0;
	const crossAxisEndPosition = getLinePosition(crossAxisLines, crossAxisEnd) ?? 1;

	// Check if an overlapping group already exists
	if (
		matchingGroups.some((group) => {
			const groupStartPosition = getLinePosition(crossAxisLines, group.start) ?? 0;
			const groupEndPosition = getLinePosition(crossAxisLines, group.end) ?? 1;

			return (
				groupStartPosition <= crossAxisStartPosition && groupEndPosition >= crossAxisEndPosition
			);
		})
	)
		return;

	const expandedGroup = matchingGroups.some((group) => {
		const groupStartPosition = getLinePosition(crossAxisLines, group.start) ?? 0;
		const groupEndPosition = getLinePosition(crossAxisLines, group.end) ?? 1;

		let expandedGroup = false;
		if (
			(group.start === crossAxisEnd || groupStartPosition < crossAxisEndPosition) &&
			groupStartPosition > crossAxisStartPosition
		) {
			group.start = crossAxisStart;
			expandedGroup = true;
		}
		if (
			(group.end === crossAxisStart || groupEndPosition > crossAxisStartPosition) &&
			groupEndPosition < crossAxisEndPosition
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

export function getContainerSizeInDirection(direction: GridLineDirection, element: HTMLElement) {
	return direction === GridLineDirection.Row ? element.clientHeight : element.clientWidth;
}

export interface GetMinMaxValidLinePositionProps {
	lineName: string;
	direction: GridLineDirection;
	lines: EditableGridLines;
	cells: EditableGridCellData[];
	gridContainer: HTMLElement;
	minCellWidth?: number;
	minCellHeight?: number;
}
export function getMinMaxValidLinePosition({
	lineName,
	direction,
	lines,
	cells,
	gridContainer,
	minCellWidth = gridMinCellWidth,
	minCellHeight = gridMinCellHeight,
}: GetMinMaxValidLinePositionProps) {
	// find cells that use the line
	const neighboringCells = cells.filter(
		(cell) => cell.bounds[direction].start === lineName || cell.bounds[direction].end === lineName,
	);

	const linePosition = getLinePosition(lines[direction], lineName) ?? 0;
	const neighboringLinesPositions = [
		...new Set(
			neighboringCells.map((cell) => {
				if (cell.bounds[direction].start === lineName) {
					return cell.bounds[direction].end;
				}

				return cell.bounds[direction].start;
			}),
		),
	].map((line) => getLinePosition(lines[direction], line) ?? 0);

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

	const containerSize = getContainerSizeInDirection(direction, gridContainer);
	const relativeOffset =
		direction === GridLineDirection.Row
			? minCellHeight / containerSize
			: minCellWidth / containerSize;

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
	lineName: string;
	direction: GridLineDirection;
	lines: EditableGridLines;
	cells: EditableGridCellData[];
	gridContainer: HTMLElement;
	minCellWidth?: number;
	minCellHeight?: number;
}
export function getNewLinePosition({
	requestedPosition,
	lineName,
	direction,
	lines,
	cells,
	gridContainer,
	minCellWidth,
	minCellHeight,
}: GetNewLinePositionProps) {
	const linesMatchingDirectionExceptMovedLine = lines[direction].filter(
		(line) => line.name !== lineName,
	);

	const snappedPosition = snapLinePosition(
		requestedPosition,
		linesMatchingDirectionExceptMovedLine,
		getContainerSizeInDirection(direction, gridContainer),
	);

	const { min, max } = getMinMaxValidLinePosition({
		lineName: lineName,
		direction,
		cells,
		gridContainer,
		lines,
		minCellWidth,
		minCellHeight,
	});

	const clampedPosition = Math.max(min, Math.min(max, snappedPosition));

	return clampedPosition;
}
