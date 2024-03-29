<script>
	import FloatingFocus from '$lib/components/floating-focus/floating-focus.svelte';
	import '../app.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
</script>

<div class="flex h-full flex-col items-stretch">
	<Header />

	<main class="grow">
		<slot />
	</main>

	<Footer />
</div>

<FloatingFocus />

<style>
	:global(html) {
		height: 100%;
	}

	:global(body) {
		height: 100%;
		overflow: hidden auto;
	}
</style>
