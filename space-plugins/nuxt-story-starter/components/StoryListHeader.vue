<script setup lang="ts">
import type { Story } from '~/types/story';

const props = defineProps<{
	stories: Story[];
	isStorySelected: (storyId: number) => boolean;
	selectAll: () => void;
	unselectAll: () => void;
}>();

type Status = 'none' | 'some' | 'all';

const status = computed<Status>(() => {
	const selectedStoryCount = props.stories.filter((story) =>
		props.isStorySelected(story.id),
	).length;

	if (selectedStoryCount === props.stories.length) {
		return 'all';
	} else if (selectedStoryCount === 0) {
		return 'none';
	} else {
		return 'some';
	}
});
</script>

<template>
	<thead class="bg-gray-100">
		<tr>
			<th class="flex items-center gap-3">
				<button
					v-if="status === 'none'"
					type="button"
					class="btn btn-sm btn-ghost btn-check"
					@click="selectAll"
				>
					<LucideSquare :size="20" :stroke-width="1" />
					<span class="sr-only">Select All Stories</span>
				</button>
				<button
					v-else-if="status === 'some'"
					type="button"
					class="btn btn-sm btn-ghost btn-check"
					@click="selectAll"
				>
					<LucideMinusSquare :size="20" :stroke-width="1" />
					<span class="sr-only">Select All Stories</span>
				</button>
				<button
					v-else-if="status === 'all'"
					type="button"
					class="btn btn-sm btn-ghost btn-check"
					@click="unselectAll"
				>
					<LucideCheckSquare2 :size="20" :stroke-width="1" />
					<span class="sr-only">Unselect All Stories</span>
				</button>
				<span class="ml-9">Name</span>
			</th>
			<th class="w-32">Content Type</th>
			<th class="w-28">Last Update</th>
			<th class="w-28">Author</th>
		</tr>
	</thead>
</template>

<style scoped>
th {
	@apply font-normal text-sm text-gray-600 text-left p-4;
}

.btn-check {
	@apply m-0 py-2 px-0.5 border-0 text-gray-500;
}

.btn-check:hover {
	@apply bg-transparent;
}
</style>
