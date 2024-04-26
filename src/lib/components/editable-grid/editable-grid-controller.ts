import {
	GridLineAxis,
	gridLineKeyboardMoveDistance,
	type DraggedLine,
	type EditableGridCellBounds,
	type EditableGridCellData,
	type EditableGridLine,
	type EditableGridLines,
} from '$lib/components/editable-grid/editable-grid.model';
import {
	calculateRelativePosition,
	getContainerSizeInAxis,
	getNewCell,
	getNewLinePosition,
	invertAxis,
} from '$lib/components/editable-grid/editable-grid.utils';
import { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import { WonderEventEmitter } from '@grekomp/wonder-event-emitter';
import { writable, type Writable } from 'svelte/store';

export class EditableGridController {
	private __lines: EditableGridLines;
	lines: Writable<EditableGridLines>;

	private __cells: EditableGridCellData[];
	cells: Writable<EditableGridCellData[]>;

	private __draggedLine?: DraggedLine;
	draggedLine: Writable<DraggedLine | undefined> = writable(undefined);

	gridContainer?: HTMLElement;
	eventEmitter: WonderEventEmitter;
	interactionStack: InteractionStack;

	constructor({
		lines,
		cells,
		eventEmitter = new WonderEventEmitter(),
		interactionStack = new InteractionStack(),
	}: {
		lines: EditableGridLines;
		cells: EditableGridCellData[];
		eventEmitter?: WonderEventEmitter;
		interactionStack?: InteractionStack;
	}) {
		this.__lines = lines;
		this.__cells = cells;

		this.lines = writable(lines);
		this.cells = writable(cells);
		this.eventEmitter = eventEmitter;
		this.interactionStack = interactionStack;

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDragLine = this.handleDragLine.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
	}

	// #region Managing lines
	findLine(lineName: string, axis: GridLineAxis) {
		return this.__lines[axis].find((line) => line.name === lineName);
	}
	findLineAxis(line: EditableGridLine): GridLineAxis | null {
		if (this.__lines.row.includes(line)) return GridLineAxis.Row;
		if (this.__lines.col.includes(line)) return GridLineAxis.Col;
		return null;
	}
	replaceLineInCells(lineToReplace: EditableGridLine, newLine: EditableGridLine) {
		this.__cells.forEach((cell) => {
			if (cell.bounds.row.start === lineToReplace) cell.bounds.row.start = newLine;
			if (cell.bounds.row.end === lineToReplace) cell.bounds.row.end = newLine;
			if (cell.bounds.col.start === lineToReplace) cell.bounds.col.start = newLine;
			if (cell.bounds.col.end === lineToReplace) cell.bounds.col.end = newLine;
		});
	}
	removeUnusedLines() {
		this.__lines.row = this.__lines.row.filter((line) => {
			return this.__cells.some(
				(cell) => cell.bounds.row.start === line || cell.bounds.row.end === line,
			);
		});
		this.__lines.col = this.__lines.col.filter((line) => {
			return this.__cells.some(
				(cell) => cell.bounds.col.start === line || cell.bounds.col.end === line,
			);
		});
	}
	areLinesAligned(line1: EditableGridLine, line2: EditableGridLine) {
		return Math.abs(line1.position - line2.position) < 0.00001;
	}
	// #endregion Managing lines

	// #region Managing cells
	expandCell(cell: EditableGridCellData, toLine: EditableGridLine) {
		const axis = this.findLineAxis(toLine);
		if (!axis) return;

		if (cell.bounds[axis].start.position > toLine.position) cell.bounds[axis].start = toLine;
		if (cell.bounds[axis].end.position < toLine.position) cell.bounds[axis].end = toLine;
	}

	/**
	 * Returns true, if cell1 is above/to the left of cell2 in the given axis.
	 */
	areCellsSorted(cell1: EditableGridCellData, cell2: EditableGridCellData, axis: GridLineAxis) {
		const inverseAxis = invertAxis(axis);
		return cell1.bounds[inverseAxis].start.position < cell2.bounds[inverseAxis].start.position;
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

		if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine) return false;

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
		if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine) return false;

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

		if (!cell1StartLine || !cell2StartLine || !cell1EndLine || !cell2EndLine) return false;
		if (cell1StartLine === cell2EndLine || cell1EndLine === cell2StartLine) return true;

		return false;
	}

	// #region Splitting and merging cells
	splitCell(cell: EditableGridCellData, axis: GridLineAxis, relativeSplitPosition: number = 0.5) {
		const newLineName = `mid-${crypto.randomUUID()}`;

		const startLine = cell.bounds[axis].start;
		const endLine = cell.bounds[axis].end;

		if (!startLine || !endLine) return;

		const newLinePosition =
			startLine.position + (endLine.position - startLine.position) * relativeSplitPosition;

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

		this.lines.set(this.__lines);
		this.cells.set(this.__cells);
	}

	canMergeCells(source: EditableGridCellData, target: EditableGridCellData): boolean {
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
		if (!this.areCellsNeighborsInAxis(source, target, alignedAxis)) return false;

		return alignedAxis;
	}

	mergeCells(source: EditableGridCellData, target: EditableGridCellData) {
		if (source === target) return;

		const axis = this.findValidCellsMergeAxis(source, target);

		if (!axis) return;

		if (!this.areCellsAlignedPerfectlyInAxis(source, target, axis)) {
			this.replaceLineInCells(target.bounds[axis].start, source.bounds[axis].start);
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
		this.removeUnusedLines();

		this.cells.set(this.__cells);
		this.lines.set(this.__lines);
	}
	// #endregion Splitting and merging cells
	// #endregion Managing cells

	// TODO: Refactor this to use the interaction stack
	// #region Moving lines
	handleDragStart(event: MouseEvent, lineName: string, axis: GridLineAxis) {
		const line = this.findLine(lineName, axis);

		if (!line) return;

		this.__draggedLine = {
			line,
			axis,
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
			this.__draggedLine.axis === GridLineAxis.Col ? relativePosition.x : relativePosition.y;

		const newPosition = getNewLinePosition({
			requestedPosition,
			line: this.__draggedLine.line,
			axis: this.__draggedLine.axis,
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

	handleLineKeyboardMove(event: KeyboardEvent, lineName: string, axis: GridLineAxis) {
		if (axis === GridLineAxis.Col && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
			return;
		if (axis === GridLineAxis.Row && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

		if (!this.gridContainer) return;

		const line = this.findLine(lineName, axis);

		if (!line) return;

		const isIncrement = event.key === 'ArrowRight' || event.key === 'ArrowDown';
		const movementAxisMultiplier = isIncrement ? 1 : -1;
		const pixelPositionOffset = movementAxisMultiplier * gridLineKeyboardMoveDistance;
		const relativePositionOffset =
			pixelPositionOffset / getContainerSizeInAxis(axis, this.gridContainer);
		const requestedPosition = line.position + relativePositionOffset;

		const newPosition = getNewLinePosition({
			requestedPosition,
			line,
			cells: this.__cells,
			lines: this.__lines,
			axis,
			gridContainer: this.gridContainer,
		});

		line.position = newPosition;

		this.lines.set(this.__lines);
		// #endregion Moving lines
	}
}
