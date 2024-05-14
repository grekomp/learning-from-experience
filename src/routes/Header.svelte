<script>
	import A from '$lib/components/ui/basic-html/a.svelte';
	import Navlink from '$lib/components/ui/navlink/navlink.svelte';
</script>

<header class="mb-5 border-b">
	<nav class="mx-auto max-w-5xl">
		<ul class="flex items-center gap-5">
			<li>
				<A
					href="/"
					class="block p-3 text-xl font-black text-primary transition-colors hover:text-foreground focus:text-foreground"
					>Learning from Experience</A
				>
			</li>
			<li>
				<Navlink href="/about">About</Navlink>
			</li>
			<li>
				<Navlink href="/posts">Posts</Navlink>
			</li>
			<li>
				<Navlink href="/editable-grid">Editable Grid</Navlink>
			</li>
			<li>
				<Navlink href="https://www.npmjs.com/package/@grekomp/wonder-event-emitter"
					>Wonder Event Emitter</Navlink
				>
			</li>
		</ul>
	</nav>
</header>
