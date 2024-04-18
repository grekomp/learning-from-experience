import {
	EditableGridCellEvents,
	isGridCellEventOfType,
} from '$lib/components/editable-grid/dom-events/editable-grid-cell-events';
import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';
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
		document.addEventListener(EditableGridCellEvents.MouseEnter, this.onCellMouseEnter);
		document.addEventListener(EditableGridCellEvents.Click, this.onCellClick);
	}
	_onComplete() {
		if (this.data.fromCell && this.data.toCell) {
			this.data.grid.mergeCells(this.data.fromCell, this.data.toCell);
		}
	}
	_onDispose() {
		document.removeEventListener(EditableGridCellEvents.MouseEnter, this.onCellMouseEnter);
		document.removeEventListener(EditableGridCellEvents.Click, this.onCellClick);
	}

	onCellMouseEnter(event: Event) {
		if (!isGridCellEventOfType(event, EditableGridCellEvents.MouseEnter)) return;

		event.preventDefault();
		event.stopPropagation();

		this.setTargetCell(event.detail.cell);
	}
	onCellClick(event: Event) {
		if (!isGridCellEventOfType(event, EditableGridCellEvents.Click)) return;

		event.preventDefault();
		event.stopPropagation();

		this.complete();
	}
}
