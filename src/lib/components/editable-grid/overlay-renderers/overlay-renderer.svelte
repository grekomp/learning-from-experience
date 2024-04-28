<script lang="ts">
	import {
		OverlayTargetType,
		type EditableGridOverlayData,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import AreasOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/areas-overlay-renderer.svelte';
	import CellsOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/cells-overlay-renderer.svelte';
	import ContainerOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/container-overlay-renderer.svelte';
	import LinesOverlayRendrerer from '$lib/components/editable-grid/overlay-renderers/lines-overlay-renderer.svelte';

	export let overlay: EditableGridOverlayData;
	let overlayWithDefaults: EditableGridOverlayData;
	$: overlayWithDefaults = {
		...overlay,
		zIndex: overlay.zIndex ?? 0,
		pointerEvents: overlay.pointerEvents ?? 'auto',
	};
</script>

{#if overlayWithDefaults.targetType === OverlayTargetType.Cells}
	<CellsOverlayRenderer overlay={overlayWithDefaults} />
{/if}
{#if overlayWithDefaults.targetType === OverlayTargetType.Lines}
	<LinesOverlayRendrerer overlay={overlayWithDefaults} />
{/if}
{#if overlayWithDefaults.targetType === OverlayTargetType.Areas}
	<AreasOverlayRenderer overlay={overlayWithDefaults} />
{/if}
{#if overlayWithDefaults.targetType === OverlayTargetType.Container}
	<ContainerOverlayRenderer overlay={overlayWithDefaults} />
{/if}
{#if overlayWithDefaults.targetType === OverlayTargetType.Custom}
	<svelte:component this={overlay.component} overlay={overlayWithDefaults} />
{/if}
