<script lang="ts">
	import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';

	export let cell: EditableGridCellData;
</script>

<header class="bg-muted p-4 text-center text-muted-foreground">
	{cell.title}
</header>
