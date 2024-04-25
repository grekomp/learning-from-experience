import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import {
	gridEvents,
	type EditableGridCellData,
} from '$lib/components/editable-grid/editable-grid.model';
import type { DataTypeOf } from '$lib/modules/event-emitter/event-descriptors.model';
import { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import type { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';

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

		this.onCellMouseEnter = this.onCellMouseEnter.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
	}

	setTargetCell(cell: EditableGridCellData) {
		if (cell === this.data.fromCell) {
			this.data = { ...this.data, toCell: undefined };
			return;
		}

		this.data = { ...this.data, toCell: cell };
	}

	_onStart() {
		this.data.grid.eventEmitter.on(gridEvents.cell.mouseEnter, this.onCellMouseEnter);
		this.data.grid.eventEmitter.on(gridEvents.cell.click, this.onCellClick);
	}
	_onComplete() {
		if (this.data.fromCell && this.data.toCell) {
			this.data.grid.mergeCells(this.data.fromCell, this.data.toCell);
		}
	}
	_onDispose() {
		this.data.grid.eventEmitter.off(gridEvents.cell.mouseEnter, this.onCellMouseEnter);
		this.data.grid.eventEmitter.off(gridEvents.cell.click, this.onCellClick);
	}

	onCellMouseEnter({ cell }: DataTypeOf<typeof gridEvents.cell.mouseEnter>) {
		this.setTargetCell(cell);
	}
	onCellClick() {
		this.complete();
	}
}
