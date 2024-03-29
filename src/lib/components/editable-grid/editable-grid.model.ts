export const gridStartLine = 'start' as const;
export const gridEndLine = 'end' as const;
export const gridLineSnapDistance = 10;

export interface EditableGridCellBounds {
	row: EditableGridCellBoundsAxis;
	col: EditableGridCellBoundsAxis;
}

export interface EditableGridCellBoundsAxis {
	start: string;
	end: string;
}

export interface EditableGridCellData {
	bounds: EditableGridCellBounds;
	title?: string;
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
	rows: EditableGridLine[];
	cols: EditableGridLine[];
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
	start: string;
	/**
	 * The cross axis grid line that the group ends at.
	 */
	end: string;
}

export enum GridLineDirection {
	Row = 'row',
	Col = 'col',
}

export interface DraggingLine {
	name: string;
	direction: GridLineDirection;
	startX: number;
	startY: number;
}
