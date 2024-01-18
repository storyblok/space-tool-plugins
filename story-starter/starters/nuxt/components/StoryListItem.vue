<script setup lang="ts">
import type { Story } from '~/types/story';

const props = defineProps<{
	story: Story;
	checked: boolean;
	updateStorySelection: (id: number, checked: boolean) => void;
	enterFolder: (slug: string) => void;
}>();

const lastUpdate = computed(() => {
	const timestamp = props.story.updated_at || props.story.created_at;
	const [date, time] = timestamp.split('T');
	return [date, time.slice(0, 5)];
});

const onChange = (event: Event) => {
	if (!event.target) {
		return;
	}
	props.updateStorySelection(
		props.story.id,
		(event.target as HTMLInputElement).checked
	);
};

const onItemClick = (story: Story) => {
	if (story.is_folder) {
		props.enterFolder(story.slug);
	}
};
</script>

<template>
	<tr class="hover:bg-gray-100">
		<td class="flex items-center gap-4">
			<input
				:id="story.id.toString()"
				class="checkbox checkbox-xs"
				type="checkbox"
				aria-label="Toggle Story"
				:name="story.id.toString()"
				:checked="props.checked"
				@change="onChange"
			/>

			<LucideFolder v-if="story.is_folder" class="text-gray-400" :size="16" />
			<LucideDisc v-else class="text-gray-300" :size="16" />

			<button
				v-if="story.is_folder"
				class="text-left"
				@click="onItemClick(story)"
			>
				<div class="text-sm">
					{{ story.name }}
				</div>
				<div class="text-xs font-light text-gray-400">
					{{ story.slug }}
				</div>
			</button>
			<div v-else>
				<div class="text-sm">
					{{ story.name }}
				</div>
				<div class="text-xs font-light text-gray-400">
					{{ story.slug }}
				</div>
			</div>
		</td>
		<td class="text-sm font-light text-gray-500">
			{{ story.content_type }}
		</td>
		<td class="text-xs font-light text-gray-500">
			{{ lastUpdate[0] }}<br />{{ lastUpdate[1] }}
		</td>
		<td class="text-sm font-light text-gray-500">
			{{ story.last_author.friendly_name }}
		</td>
	</tr>
</template>

<style scoped>
td {
	@apply p-4;
}
</style>
