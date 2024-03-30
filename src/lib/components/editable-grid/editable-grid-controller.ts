import {
	GridLineDirection,
	gridLineKeyboardMoveDistance,
	type DraggedLine,
	type EditableGridCellBounds,
	type EditableGridCellData,
	type EditableGridLines,
} from '$lib/components/editable-grid/editable-grid.model';
import {
	calculateRelativePosition,
	getContainerSizeInDirection,
	getNewCell,
	getNewLinePosition,
} from '$lib/components/editable-grid/editable-grid.utils';
import { writable, type Writable } from 'svelte/store';

export class EditableGridController {
	private __lines: EditableGridLines;
	lines: Writable<EditableGridLines>;

	private __cells: EditableGridCellData[];
	cells: Writable<EditableGridCellData[]>;

	private __draggedLine?: DraggedLine;
	draggedLine: Writable<DraggedLine | undefined> = writable(undefined);

	gridContainer?: HTMLElement;

	constructor(lines: EditableGridLines, cells: EditableGridCellData[]) {
		this.__lines = lines;
		this.__cells = cells;

		this.lines = writable(lines);
		this.cells = writable(cells);

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
	}

	findLine(lineName: string, direction: GridLineDirection) {
		return this.__lines[direction].find((line) => line.name === lineName);
	}

	splitCell(
		cell: EditableGridCellData,
		direction: GridLineDirection,
		relativeSplitPosition: number = 0.5,
	) {
		const newLineName = `mid-${crypto.randomUUID()}`;

		const startLine = this.findLine(cell.bounds[direction].start, direction);
		const endLine = this.findLine(cell.bounds[direction].end, direction);

		if (!startLine || !endLine) return;

		const newLinePosition =
			startLine.position + (endLine.position - startLine.position) * relativeSplitPosition;

		this.__lines[direction].push({
			name: newLineName,
			position: newLinePosition,
		});

		const newCellBounds: EditableGridCellBounds = {
			row: { start: cell.bounds.row.start, end: cell.bounds.row.end },
			col: { start: cell.bounds.col.start, end: cell.bounds.col.end },
		};
		newCellBounds[direction].start = newLineName;

		cell.bounds[direction].end = newLineName;

		const newCell = getNewCell({ bounds: newCellBounds, splitFrom: cell });
		this.__cells.push(newCell);

		this.lines.set(this.__lines);
		this.cells.set(this.__cells);
	}

	// #region Moving lines
	handleDragStart(event: MouseEvent, lineName: string, direction: GridLineDirection) {
		const line = this.findLine(lineName, direction);

		if (!line) return;

		this.__draggedLine = {
			line,
			direction,
			startX: event.clientX,
			startY: event.clientY,
		};
		this.draggedLine.set(this.__draggedLine);
	}
	handleDragLine(event: MouseEvent) {
		if (!this.gridContainer) return;
		if (!this.__draggedLine) return;

		const relativePosition = calculateRelativePosition(
			event.clientX,
			event.clientY,
			this.gridContainer,
		);
		const requestedPosition =
			this.__draggedLine.direction === GridLineDirection.Col
				? relativePosition.x
				: relativePosition.y;

		const newPosition = getNewLinePosition({
			requestedPosition,
			lineName: this.__draggedLine.line.name,
			direction: this.__draggedLine.direction,
			lines: this.__lines,
			cells: this.__cells,
			gridContainer: this.gridContainer,
		});

		this.__draggedLine.line.position = newPosition;

		this.draggedLine.set(this.__draggedLine);
		this.lines.set(this.__lines);
	}
	handleDragEnd() {
		this.__draggedLine = undefined;
		this.draggedLine.set(undefined);
	}

	handleLineKeyboardMove(event: KeyboardEvent, lineName: string, direction: GridLineDirection) {
		if (
			direction === GridLineDirection.Col &&
			event.key !== 'ArrowLeft' &&
			event.key !== 'ArrowRight'
		)
			return;
		if (direction === GridLineDirection.Row && event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
			return;

		if (!this.gridContainer) return;

		const line = this.findLine(lineName, direction);

		if (!line) return;

		const isIncrement = event.key === 'ArrowRight' || event.key === 'ArrowDown';
		const movementDirectionMultiplier = isIncrement ? 1 : -1;
		const pixelPositionOffset = movementDirectionMultiplier * gridLineKeyboardMoveDistance;
		const relativePositionOffset =
			pixelPositionOffset / getContainerSizeInDirection(direction, this.gridContainer);
		const requestedPosition = line.position + relativePositionOffset;

		const newPosition = getNewLinePosition({
			requestedPosition,
			lineName,
			cells: this.__cells,
			lines: this.__lines,
			direction,
			gridContainer: this.gridContainer,
		});

		line.position = newPosition;

		this.lines.set(this.__lines);
		// #endregion Moving lines
	}
}
