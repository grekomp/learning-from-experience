import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';
import { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import type { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import { noop } from '$lib/utils/noop.utils';

export interface EditableGridCellMergeDragInteractionData {
	grid: EditableGridController;
	fromCell: EditableGridCellData;
	toCell?: EditableGridCellData;
}

export const editableGridCellMergeDragInteractionType =
	'EditableGridCellMergeDragInteraction' as const;

export class EditableGridCellMergeDragInteraction extends InteractionBase<
	EditableGridCellMergeDragInteraction,
	typeof editableGridCellMergeDragInteractionType,
	EditableGridCellMergeDragInteractionData
> {
	constructor(stack: InteractionStack, data: EditableGridCellMergeDragInteractionData) {
		super(stack, data, editableGridCellMergeDragInteractionType);
	}

	setTargetCell(cell: EditableGridCellData) {
		if (cell === this.data.fromCell) {
			this.data.toCell = undefined;
			return;
		}

		this.data.toCell = cell;
	}

	_onStart = noop;
	_onComplete() {
		if (this.data.fromCell && this.data.toCell) {
			this.data.grid.mergeCells(this.data.fromCell, this.data.toCell);
		}
	}
	_onCancel = noop;
	_onStackPop = noop;
}
