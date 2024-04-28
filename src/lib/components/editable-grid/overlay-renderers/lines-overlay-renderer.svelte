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

	const grid = getContext<EditableGridController>(gridContext);
	let lines = grid.lines;

	$: useLineBounds = overlay.options?.useLineBounds ?? true;
	$: target =
		overlay.target ??
		[...$lines.col, ...$lines.row].filter(
			(line) => line.name !== gridStartLine && line.name !== gridEndLine,
		);
</script>

{#each target as line}
	{@const axis = grid.findLineAxis(line)}
	{@const lineBounds = useLineBounds ? grid.getLineBounds(line) : null}
	{#if axis === GridLineAxis.Row}
		<div
			style:grid-row-start={line.name}
			style:grid-row-end={gridEndLine}
			style:grid-column-start={lineBounds?.start.name ?? gridStartLine}
			style:grid-column-end={lineBounds?.end.name ?? gridEndLine}
			style:z-index={overlay.zIndex}
			class="pointer-events-none relative"
		>
			<div class="relative h-0 w-full" style:pointer-events={overlay.pointerEvents}>
				<svelte:component this={overlay.component} {overlay} {lineBounds} />
			</div>
		</div>
	{/if}
	{#if axis === GridLineAxis.Col}
		<div
			style:grid-column-start={line.name}
			style:grid-column-end={gridEndLine}
			style:grid-row-start={lineBounds?.start.name ?? gridStartLine}
			style:grid-row-end={lineBounds?.end.name ?? gridEndLine}
			style:z-index={overlay.zIndex}
			class="pointer-events-none relative"
		>
			<div class="relative h-full w-0" style:pointer-events={overlay.pointerEvents}>
				<svelte:component this={overlay.component} {overlay} {lineBounds} />
			</div>
		</div>
	{/if}
{/each}
