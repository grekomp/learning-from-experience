<script lang="ts">
	import H1 from '$lib/components/ui/basic-html/h1.svelte';
	import H2 from '$lib/components/ui/basic-html/h2.svelte';
	import H3 from '$lib/components/ui/basic-html/h3.svelte';
	import H4 from '$lib/components/ui/basic-html/h4.svelte';
	import P from '$lib/components/ui/basic-html/p.svelte';

	export let text: string;
	export let depth: number;

	let component: typeof H1 | typeof H2 | typeof H3 | typeof H4 | typeof P;
	$: {
		switch (depth) {
			case 1:
				component = H1;
				break;
			case 2:
				component = H2;
				break;
			case 3:
				component = H3;
				break;
			case 4:
			default:
				component = P;
				break;
		}
	}
</script>

<svelte:component this={component}>
	{text}
</svelte:component>
