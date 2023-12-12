<script setup lang="ts">
defineProps<{
	goToPage: (page: number) => void;
	currentPage: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	numberOfPages: number;
}>();
</script>

<template>
	<div class="join">
		<button
			class="btn btn-ghost btn-sm join-item"
			@click="goToPage(currentPage - 1)"
			:disabled="!hasPreviousPage"
		>
			<span class="sr-only">Previous Page</span>
			<LucideChevronLeft :size="16" />
		</button>
		<div v-for="(_item, idx) in new Array(numberOfPages)">
			<button
				class="font-normal btn btn-ghost btn-sm join-item"
				:class="{
					'current-page': currentPage === idx + 1,
				}"
				:disabled="currentPage === idx + 1"
				@click="goToPage(idx + 1)"
			>
				{{ idx + 1 }}
			</button>
		</div>
		<button
			class="btn btn-ghost btn-sm join-item"
			@click="goToPage(currentPage + 1)"
			:disabled="!hasNextPage"
		>
			<span class="sr-only">Next Page</span>
			<LucideChevronRight :size="16" />
		</button>
	</div>
</template>

<style scoped>
.current-page {
	@apply text-primary opacity-50;
}
</style>
