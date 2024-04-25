import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';

export interface EditableGridCellMouseEventData {
	cell: EditableGridCellData;
	originalEvent: MouseEvent;
}
