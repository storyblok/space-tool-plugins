<script setup lang="ts">
defineProps<{
	isHome: boolean;
	isClickable: boolean;
	label: string;
}>();
defineEmits<{
	(event: 'click'): void;
}>();
</script>

<template>
	<button
		v-if="isClickable"
		type="button"
		class="flex items-center gap-1 hover:text-gray-800"
		@click="$emit('click')"
	>
		<LucideHome v-if="isHome" :size="14" />
		<LucideFolder v-else :size="14" />
		<span>{{ label }}</span>
	</button>
	<span v-else class="flex items-center gap-1 text-gray-400">
		<LucideHome v-if="isHome" :size="14" />
		<LucideFolder v-else :size="14" />
		<span>{{ label }}</span>
	</span>
</template>
