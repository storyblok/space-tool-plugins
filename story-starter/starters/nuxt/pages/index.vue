<script setup lang="ts">
import type { ISbStoryData } from 'storyblok-js-client';

const pageLoaded = ref(1);
const { data } = await useFetch(`/api/stories`, {
	query: {
		perPage: 10,
		page: pageLoaded,
	},
});

const totalStories = computed(() => data?.value?.total);

const allStories = ref<ISbStoryData[]>([]);
watch(
	data,
	(newData) => {
		allStories.value = [
			...allStories.value,
			...((newData?.stories || []) as ISbStoryData[]),
		];
	},
	{ immediate: true }
);

const isLoadedAll = computed(
	() => allStories.value.length >= (totalStories.value ?? 0)
);

const loadMore = () => {
	pageLoaded.value = pageLoaded.value += 1;
};
</script>

<template>
	<div v-for="(item, index) in allStories" :key="index">
		<pre>{{ item.name }} (/{{ item.slug }})</pre>
	</div>
	<button @click="loadMore" v-if="!isLoadedAll">load more</button>
</template>
