<script lang="ts">
	import type { EditableGridCellBounds } from '$lib/components/editable-grid/editable-grid.model';
	import { cn } from '$lib/utils';

	export let bounds: EditableGridCellBounds;
	export let title: string | undefined = undefined;
</script>

<div
	style:grid-row-start={bounds.row.start}
	style:grid-row-end={bounds.row.end}
	style:grid-column-start={bounds.col.start}
	style:grid-column-end={bounds.col.end}
	{...$$restProps}
	class={cn(
		'm-[calc(var(--grid-gap)/2)] min-h-0 min-w-0 overflow-auto rounded-sm border-2 border-neutral-900 bg-neutral-800',
		$$props.class,
	)}
	role="cell"
	tabindex="0"
	on:click
>
	<div class="p-4">
		{#if title}
			<div class="text-xs text-muted-foreground">{title}</div>
		{/if}
		<slot />
	</div>
</div>

<style>
</style>
