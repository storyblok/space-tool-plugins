<script setup lang="ts">
import type { StoryAction } from '~/types/config';
defineProps<{
	actions: StoryAction[];
	selectedCount: number;
	unselectAllStories: () => void;
}>();
</script>

<template>
	<div
		v-if="selectedCount > 0"
		class="rounded-md navbar bg-secondary text-secondary-content"
	>
		<div class="flex-1">
			<span class="ml-2 text-sm font-normal"
				>{{ selectedCount }} items selected</span
			>
			<button
				class="ml-2 btn btn-sm btn-ghost"
				@click="unselectAllStories"
				type="button"
			>
				Clear
			</button>
		</div>
		<div class="flex-none">
			<ul class="flex gap-2 mr-2">
				<li v-for="action in actions">
					<button type="button" class="btn btn-sm btn-ghost">
						<component :is="action.icon" />
						<span>{{ action.label }}</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.btn {
	@apply font-normal;
}

.bg-secondary .btn-ghost:hover {
	@apply bg-ink-75;
}
</style>
