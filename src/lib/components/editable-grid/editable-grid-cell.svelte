<script lang="ts">
	import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import {
		gridContext,
		type EditableGridCellData,
	} from '$lib/components/editable-grid/editable-grid.model';
	import { cn } from '$lib/utils/shadcn.utils';
	import { getContext } from 'svelte';

	export let cell: EditableGridCellData;
	const grid = getContext<EditableGridController>(gridContext);

	const handleMouseEnter = (event: MouseEvent) => {
		grid.events.cell.mouseEnter.emit({ cell, originalEvent: event });
	};
	const handleMouseMove = (event: MouseEvent) => {
		grid.events.cell.mouseMove.emit({ cell, originalEvent: event });
	};
	const handleClick = (event: MouseEvent) => {
		grid.events.cell.click.emit({ cell, originalEvent: event });
	};
	const handleMouseLeave = (event: MouseEvent) => {
		grid.events.cell.mouseLeave.emit({ cell, originalEvent: event });
	};
</script>

<div
	style:grid-row-start={cell.bounds.row.start.name}
	style:grid-row-end={cell.bounds.row.end.name}
	style:grid-column-start={cell.bounds.col.start.name}
	style:grid-column-end={cell.bounds.col.end.name}
	{...$$restProps}
	class={cn(
		'group relative m-[calc(var(--grid-gap)/2)] min-h-0 min-w-0 overflow-auto rounded-sm bg-muted/20',
		$$props.class,
	)}
	role="cell"
	tabindex="0"
	on:click={handleClick}
	on:mousemove={handleMouseMove}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
>
	{#if cell.title}
		<div
			class="absolute bottom-0 left-0 right-0 top-0 my-auto h-fit text-center text-5xl font-extrabold text-muted-foreground opacity-20"
		>
			{cell.title}
		</div>
	{/if}
	<svelte:component this={cell.component} {cell} />
	<slot />
</div>
