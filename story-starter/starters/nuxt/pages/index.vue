<script setup lang="ts">
const {
	data,
	hasNextPage,
	hasPreviousPage,
	isLoading,
	numberOfPages,
	selectedStories,
	selectStories,
	unselectStories,
	currentPage,
	isStorySelected,
	goToPage,
} = await useStories({ perPage: 11 });

const selectAll = () => {
	const allStoryIdsPerPage = data.value?.stories.map((story) => story.id) || [];
	selectStories(allStoryIdsPerPage);
};

const unselectAll = () => {
	const allStoryIdsPerPage = data.value?.stories.map((story) => story.id) || [];
	unselectStories(allStoryIdsPerPage);
};
const onChange = (event: any, id: number) => {
	if (event.target.checked) {
		selectStories(id);
		return;
	}

	unselectStories(id);
};
</script>

<template>
	<!--	TODO loading progress bar instead of 'Loading...-->
	<span v-if="isLoading">Loading...</span>
	<div v-if="!isLoading && data">
		<span>Number of selected stories {{ selectedStories.length }}</span>
		<button @click="selectAll">Select All</button>
		<button @click="unselectAll">Unselect All</button>
		<div v-for="(story, index) in data.stories" :key="index">
			<input
				type="checkbox"
				:id="story.id.toString()"
				:name="story.id.toString()"
				@change="(e) => onChange(e, story.id)"
				:checked="isStorySelected(story.id)"
			/>
			<label :for="story.id.toString()"
				>{{ story.name }} (/{{ story.slug }})</label
			>
		</div>
		<span>Current Page {{ currentPage }}</span>

		<button @click="goToPage(currentPage - 1)" :disabled="!hasPreviousPage">
			Previous Page
		</button>
		<div v-for="(item, idx) in new Array(numberOfPages)">
			<button @click="goToPage(idx + 1)">
				{{ idx + 1 }}
			</button>
		</div>
		<button @click="goToPage(currentPage + 1)" :disabled="!hasNextPage">
			Next Page
		</button>
	</div>
	<pre>{{ JSON.stringify(selectedStories, null, 2) }}</pre>
</template>
