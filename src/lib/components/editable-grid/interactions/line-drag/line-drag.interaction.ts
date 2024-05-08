import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import {
	OverlayTargetType,
	type EditableGridOverlayData,
} from '$lib/components/editable-grid/editable-grid-overlay.model';
import {
	GridLineAxis,
	gridEvents,
	type EditableGridLine,
} from '$lib/components/editable-grid/editable-grid.model';
import {
	calculateRelativePosition,
	getNewLinePosition,
} from '$lib/components/editable-grid/editable-grid.utils';
import type { DataTypeOf } from '@grekomp/wonder-event-emitter';
import { Interaction } from '@grekomp/wonder-interaction-stack';

export interface EditableGridLineDragInteractionData {
	grid: EditableGridController;
	line: EditableGridLine;
	axis: GridLineAxis;
}

const overlay: EditableGridOverlayData = {
	targetType: OverlayTargetType.Container,
	component: null,
};

export class EditableGridLineDragInteraction extends Interaction<EditableGridLineDragInteractionData> {
	_onStart() {
		this.data.grid.events.container.mouseMove.on(this.onMouseMove);
		this.data.grid.addOverlay(overlay);
		document.addEventListener('mouseup', this.onMouseUp);
	}
	_onDispose() {
		this.data.grid.events.container.mouseMove.off(this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		this.data.grid.removeOverlay(overlay);
	}

	onMouseMove = (eventData: DataTypeOf<typeof gridEvents.container.mouseMove>) => {
		const { grid, line, axis } = this.data;
		const { gridContainer } = grid;

		if (!gridContainer) return;

		const relativePosition = calculateRelativePosition(
			eventData.clientX,
			eventData.clientY,
			gridContainer,
		);
		const requestedPosition = axis === GridLineAxis.Col ? relativePosition.x : relativePosition.y;

		const newPosition = getNewLinePosition({
			requestedPosition,
			line,
			axis,
			lines: grid.getLines(),
			cells: grid.getCells(),
			gridContainer,
		});

		grid.moveLine(line, newPosition);
	};

	onMouseUp = () => {
		this.complete();
	};
}
