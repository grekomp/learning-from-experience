import type { EditableGridCellMouseEventData } from '$lib/components/editable-grid/events/editable-grid-cell-events';
import { defineEvent, defineEventDictionary } from '$lib/modules/event-emitter/event-descriptors';
import type { ComponentType } from 'svelte';

export const gridContext = 'editableGridContext' as const;
export const gridInteractionStackContext = 'editableGridInteractionStackContext' as const;

export const gridStartLine = 'start' as const;
export const gridEndLine = 'end' as const;
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
	component?: ComponentType;
}

export interface EditableGridLine {
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

export interface EditableGridLineGroups {
	rows: GridLineGroup[];
	cols: GridLineGroup[];
}
export interface GridLineGroup {
	name: string;
	/**
	 * The cross axis grid line that the group starts at.
	 */
	start: EditableGridLine;
	/**
	 * The cross axis grid line that the group ends at.
	 */
	end: EditableGridLine;
}

export enum GridLineAxis {
	Row = 'row',
	Col = 'col',
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
});
