<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import type {
		EditableGridOverlayDataFor,
		OverlayTargetType,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import {
		GridLineAxis,
		gridContext,
		gridEndLine,
		gridStartLine,
	} from '$lib/components/editable-grid/editable-grid.model';
	import { getContext } from 'svelte';

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Lines>;

	$: useLineBounds = overlay.options?.useLineBounds ?? true;

	const grid = getContext<EditableGridController>(gridContext);
</script>

{#each overlay.target as line}
	{@const axis = grid.findLineAxis(line)}
	{@const bounds = useLineBounds ? grid.getLineBounds(line) : null}
	{#if axis === GridLineAxis.Row}
		<div
			style:grid-row-start={line.name}
			style:grid-row-end={gridEndLine}
			style:grid-column-start={bounds?.start.name ?? gridStartLine}
			style:grid-column-end={bounds?.end.name ?? gridEndLine}
			style:z-index={overlay.zIndex}
			class="pointer-events-none relative"
		>
			<svelte:component this={overlay.component} {overlay} />
		</div>
	{/if}
{/each}
