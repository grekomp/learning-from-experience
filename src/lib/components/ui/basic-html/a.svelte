<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
</script>

<a {href} aria-current={$page.url.pathname === href ? 'page' : undefined} {...$$restProps}
	><slot /></a
>
