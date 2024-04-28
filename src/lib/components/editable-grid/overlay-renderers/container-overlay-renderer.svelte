<script lang="ts">
	import type {
		EditableGridOverlayDataFor,
		OverlayTargetType,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import { gridEndLine, gridStartLine } from '$lib/components/editable-grid/editable-grid.model';

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Container>;
</script>

<div
	role="presentation"
	style:grid-row-start={gridStartLine}
	style:grid-row-end={gridEndLine}
	style:grid-column-start={gridStartLine}
	style:grid-column-end={gridEndLine}
	class="pointer-events-auto relative"
	style:z-index={overlay.zIndex}
>
	<svelte:component this={overlay.component} />
</div>
