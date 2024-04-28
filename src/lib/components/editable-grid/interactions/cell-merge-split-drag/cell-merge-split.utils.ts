import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import {
	GridLineAxis,
	type EditableGridCellData,
} from '$lib/components/editable-grid/editable-grid.model';
import {
	calculateRelativePosition,
	getContainerSizeInAxis,
	getMinMaxValidCellSplitPosition,
	snapLinePosition,
} from '$lib/components/editable-grid/editable-grid.utils';

export interface SplitCoords {
	axis: GridLineAxis;
	position: number;
}

export interface CalculateSplitPositionAndAxisProps {
	startX: number;
	startY: number;
	clientX: number;
	clientY: number;
	target: HTMLElement;
	grid: EditableGridController;
	cell: EditableGridCellData;
}
export function calculateSplitPositionAndAxis({
	startX,
	startY,
	clientX,
	clientY,
	target,
	grid,
	cell,
}: CalculateSplitPositionAndAxisProps): SplitCoords | null {
	if (!grid.gridContainer) return null;

	const { offsetX, offsetY } = {
		offsetX: clientX - startX,
		offsetY: clientY - startY,
	};

	if (target instanceof HTMLElement === false) return null;
	const { x: gridRelativeX, y: gridRelativeY } = calculateRelativePosition(
		clientX,
		clientY,
		grid.gridContainer,
	);

	const lineAxis = Math.abs(offsetX) > Math.abs(offsetY) ? GridLineAxis.Col : GridLineAxis.Row;
	const gridRelativePosition = lineAxis === GridLineAxis.Col ? gridRelativeX : gridRelativeY;

	const snappedPosition = snapLinePosition(
		gridRelativePosition,
		grid.getLines()[lineAxis],
		getContainerSizeInAxis(lineAxis, grid.gridContainer),
	);

	const { min, max } = getMinMaxValidCellSplitPosition({
		gridContainer: grid.gridContainer,
		cell,
		axis: lineAxis,
	});
	const clampedGridPosition = Math.min(Math.max(min, snappedPosition), max);

	const cellRelativePosition =
		(clampedGridPosition - cell.bounds[lineAxis].start.position) /
		(cell.bounds[lineAxis].end.position - cell.bounds[lineAxis].start.position);

	return {
		axis: lineAxis,
		position: cellRelativePosition,
	};
}
