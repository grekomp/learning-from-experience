<script lang="ts">
	import A from '$lib/components/ui/basic-html/a.svelte';

	export let href: string;
</script>

<A
	{href}
	class="block p-3 font-semibold text-muted-foreground transition-colors hover:text-foreground focus:text-foreground"
>
	<slot />
</A>
