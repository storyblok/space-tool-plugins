<script setup lang="ts">
import type { StoryAction } from '~/types/config';
import type { Story } from '~/types/story';
defineProps<{
	actions: StoryAction[];
	selectedStories: Story[];
	unselectAllStories: () => void;
	reloadStories: () => Promise<void>;
}>();
const { showLoader, hideLoader } = useLoader();
</script>

<template>
	<div class="rounded-md navbar bg-secondary text-secondary-content">
		<div class="flex-1">
			<span class="ml-2 text-sm font-normal"
				>{{ selectedStories.length }} items selected</span
			>
			<button
				class="ml-2 btn btn-sm btn-ghost"
				type="button"
				@click="unselectAllStories"
			>
				Clear
			</button>
		</div>
		<div class="flex-none">
			<ul class="flex gap-2 mr-2">
				<li v-for="(action, index) in actions" :key="index">
					<button
						type="button"
						class="btn btn-ghost"
						@click="
							action.handler({
								selectedStories,
								showLoader,
								hideLoader,
								reloadStories,
							})
						"
					>
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
