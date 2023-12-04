<script setup lang="ts">
const page = ref(1);
const {
	data,
	hasNextPage,
	hasPreviousPage,
	isLoading,
	numberOfPages,
	selectedStories,
	selectStory,
	unselectStory,
	currentPage,
	goToPage,
} = await useStories({ perPage: 11 });

/*
* const {
        data, // data.stories is an array of story object
        hasNextPage, // boolean in case there is a next page
        hasPreviousPage, // boolean in case there is a next page
        isLoading, // boolean while fetching of data is                  being processed
        nrOfPages, // number of all pages
        selectStory, // method (storyId: number) => void
        selectedStories, // array of selected stories
       } = await useStories({ page, perPage: 11 });
* */
const createPageArray = (size: number) => {
	return new Array(size);
};

const fetchPreviousPage = () => {
	if (hasPreviousPage) {
		page.value--;
	}
};

const fetchPage = (newPage: number) => {
	goToPage(newPage);
	page.value = newPage;
};

const onChange = (event: any, id: number) => {
	if (event.target.checked) {
		selectStory(id);
		return;
	}

	unselectStory(id);
};

const fetchNextPage = () => {
	if (hasNextPage) {
		page.value++;
	}
};
</script>

<template>
	<span v-if="isLoading">Loading...</span>
	<div v-if="!isLoading && data">
		<span>Number of selected stories {{ selectedStories.length }}</span>

		<div v-for="(story, index) in data.stories" :key="index">
			<input
				type="checkbox"
				:id="story.id.toString()"
				:name="story.id.toString()"
				@change="(e) => onChange(e, story.id)"
				:checked="selectedStories.includes(story.id)"
			/>
			<label :for="story.id.toString()"
				>{{ story.name }} (/{{ story.slug }})</label
			>
		</div>
		<span>Current Page {{ page }}</span>

		<button @click="fetchPreviousPage" :disabled="!hasPreviousPage">
			Previous Page
		</button>
		<div v-for="(item, idx) in createPageArray(numberOfPages)">
			<button @click="fetchPage(idx + 1)">
				{{ idx + 1 }}
			</button>
		</div>
		<button @click="fetchNextPage" :disabled="!hasNextPage">Next Page</button>
	</div>
</template>
