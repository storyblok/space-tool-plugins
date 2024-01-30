<script setup lang="ts">
import debounce from 'just-debounce-it';
const userInput = ref<string>();

const props = defineProps<{
	setQuery: (query: string | undefined) => void;
}>();

watch(
	userInput,
	debounce((newQuery: string | undefined) => {
		props.setQuery(newQuery);
	}, 500)
);
</script>

<template>
	<div
		class="flex items-center px-4 py-4 border border-gray-200 rounded-md hover:border-primary"
	>
		<LucideSearch class="text-gray-500 search-icon" :size="14" />
		<input
			v-model="userInput"
			type="search"
			aria-label="Search"
			placeholder="Search"
			class="flex-1 ml-2 text-gray-700 outline-none"
		/>
	</div>
</template>

<style scoped>
.search-icon {
	margin-left: 0.125rem;
}
</style>
