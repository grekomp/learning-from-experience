<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot />
	</main>

	<footer class="text-center text-sm text-muted-foreground">
		<p>© Grzegorz Palian</p>
	</footer>
</div>
