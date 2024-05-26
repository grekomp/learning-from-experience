<script lang="ts">
	import GripDownLeft from '$/lib/assets/icons/grip-down-left.svg?component';
	import GripDownRight from '$/lib/assets/icons/grip-down-right.svg?component';
	import GripUpRight from '$/lib/assets/icons/grip-up-right.svg?component';
	import { EditableGridController } from '$/lib/components/editable-grid/editable-grid-controller';
	import {
	    gridContext,
	    type EditableGridCellData,
	} from '$/lib/components/editable-grid/editable-grid.model';
	import { EditableGridCellMergeDragInteraction } from '$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction';
	import * as Tooltip from '$/lib/components/ui/tooltip';
	import { getContext } from 'svelte';

	export let cell: EditableGridCellData;
	export let size: number = 16;

	let grid = getContext<EditableGridController>(gridContext);
	let interactionStack = grid.interactionStack;

	const handleMouseDown = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const existingInteraction = interactionStack.getByType(EditableGridCellMergeDragInteraction);
		if (existingInteraction) existingInteraction.cancel();

		const newInteraction = new EditableGridCellMergeDragInteraction({
			stack: interactionStack,
			initialData: {
				grid,
				fromCell: cell,
				startX: event.clientX,
				startY: event.clientY,
			},
		});
		newInteraction.start();
	};

	const handleMouseUp = () => {
		interactionStack.getByType(EditableGridCellMergeDragInteraction)?.complete();
	};
</script>

<svelte:document on:mouseup={handleMouseUp} />

<Tooltip.Root disableHoverableContent>
	<Tooltip.Trigger asChild let:builder>
		<button
			{...builder}
			use:builder.action
			class="invisible absolute right-0 top-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
			on:mousedown={handleMouseDown}
		>
			<GripUpRight width={size} height={size} />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Merge or split cell</p>
	</Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root disableHoverableContent>
	<Tooltip.Trigger asChild let:builder>
		<button
			{...builder}
			use:builder.action
			class="invisible absolute bottom-0 right-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
			on:mousedown={handleMouseDown}
		>
			<GripDownRight width={size} height={size} />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Merge or split cell</p>
	</Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root disableHoverableContent>
	<Tooltip.Trigger asChild let:builder>
		<button
			{...builder}
			use:builder.action
			class="invisible absolute bottom-0 left-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
			on:mousedown={handleMouseDown}
		>
			<GripDownLeft width={size} height={size} />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Merge or split cell</p>
	</Tooltip.Content>
</Tooltip.Root>
