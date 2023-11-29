<script setup lang="ts">
import { useStories } from '~/utils/composable';
const page = ref(1);
const { data, hasNextPage, hasPreviousPage, isLoading, nrOfPages } =
	await useStories({ page, perPage: 11 });

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
	page.value = newPage;
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
		<div v-for="(story, index) in data.stories" :key="index">
			<pre>{{ story.name }} (/{{ story.slug }})</pre>
		</div>
		<span>Current Page {{ page }}</span>

		<button @click="fetchPreviousPage" :disabled="!hasPreviousPage">
			Previous Page
		</button>
		<div v-for="(item, idx) in createPageArray(nrOfPages)">
			<button @click="fetchPage(idx + 1)">
				{{ idx + 1 }}
			</button>
		</div>
		<button @click="fetchNextPage" :disabled="!hasNextPage">Next Page</button>
	</div>
</template>
