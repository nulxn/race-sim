<script lang="ts">
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Athletic Race Sim</title>
	<style>
		html,
		body {
			width: 100vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
		}
	</style>
</svelte:head>

<ModeWatcher />
<main class="relative flex min-h-screen flex-col bg-background">
	<header
		class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container flex h-14 w-full max-w-screen-2xl">
			<div class="ml-auto">
				<Button variant="outline" class="mt-2" size="icon" onclick={toggleMode}>
					<span
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						>🌞</span
					>
					<span
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						>🌙</span
					>
				</Button>
			</div>
		</div>
	</header>

	{@render children?.()}
</main>
