<script setup lang="ts">
const props = defineProps<{
	title: string;
}>();
</script>

<template>
	<div class="flex items-center gap-4">
		<div class="w-10 h-10 p-2 bg-gray-100 rounded-lg">
			<slot name="icon" />
		</div>
		<h1 class="text-2xl font-bold grow text-base-content">
			{{ props.title }}
		</h1>
		<div>
			<slot name="right-action-bar" />
		</div>
	</div>
	<div class="mt-2 ml-14">
		<div class="text-sm font-light text-gray-500">
			<slot name="description" />
		</div>
	</div>
</template>
