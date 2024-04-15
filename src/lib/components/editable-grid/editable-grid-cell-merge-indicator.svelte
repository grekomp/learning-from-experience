<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import {
		gridContext,
		gridInteractionStackContext,
		type EditableGridCellData,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		EditableGridCellMergeDragInteraction,
		editableGridCellMergeDragInteractionType,
	} from '$lib/components/editable-grid/interactions/cell-merge-drag.interaction';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
	import Grip from 'lucide-svelte/icons/grip';
	import { getContext } from 'svelte';

	export let cell: EditableGridCellData;

	let grid = getContext<EditableGridController>(gridContext);
	let interactionStack = getContext<InteractionStack>(gridInteractionStackContext);

	const handleMouseDown = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const existingInteraction = interactionStack.getByType(
			editableGridCellMergeDragInteractionType,
		);
		if (existingInteraction) existingInteraction.cancel();

		const newInteraction = new EditableGridCellMergeDragInteraction(interactionStack, {
			grid,
			fromCell: cell,
		});
		newInteraction.start();
	};

	const handleMouseUp = () => {
		interactionStack.getByType(editableGridCellMergeDragInteractionType)?.complete();
	};
</script>

<svelte:document on:mouseup={handleMouseUp} />

<Tooltip.Root disableHoverableContent>
	<Tooltip.Trigger asChild let:builder
		><div
			{...builder}
			use:builder.action
			class="invisible absolute bottom-0 right-0 z-[60] cursor-crosshair select-none p-1 text-muted-foreground group-hover:visible"
			on:mousedown={handleMouseDown}
		>
			<Grip />
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Merge or split cell</p>
	</Tooltip.Content>
</Tooltip.Root>
