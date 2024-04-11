<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Grip from 'lucide-svelte/icons/grip';
</script>

<Tooltip.Root disableHoverableContent>
	<Tooltip.Trigger asChild let:builder
		><div
			{...builder}
			use:builder.action
			class="invisible absolute bottom-0 right-0 z-[60] cursor-crosshair select-none p-1 text-muted-foreground group-hover:visible"
		>
			<Grip />
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Merge or split cell</p>
	</Tooltip.Content>
</Tooltip.Root>
