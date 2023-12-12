<script setup lang="ts">
import type { Story } from '~/types/story';

const props = defineProps<{
	story: Story;
	checked: boolean;
}>();

const emit = defineEmits<{
	change: [
		value: {
			id: number;
			checked: boolean;
		}
	];
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
	emit('change', {
		id: props.story.id,
		checked: (event.target as HTMLInputElement).checked,
	});
};
</script>

<template>
	<tr class="hover:bg-gray-100">
		<td>
			<label class="justify-start gap-4 cursor-pointer label">
				<input
					class="checkbox checkbox-xs"
					type="checkbox"
					:id="story.id.toString()"
					:name="story.id.toString()"
					@change="onChange"
					:checked="props.checked"
				/>
				<label class="label-text" :for="story.id.toString()"
					>{{ story.name }}<br />
					<span class="text-xs font-light text-gray-400"
						>/{{ story.slug }}</span
					></label
				>
			</label>
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
	@apply p-2;
}
</style>
