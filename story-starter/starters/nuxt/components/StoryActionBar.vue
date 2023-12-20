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
		<span>{{ selectedCount }} items selected</span>
		<button @click="unselectAllStories" type="button">Clear</button>
	</div>
</template>
