<script setup lang="ts">
import type { ISbStoryData } from 'storyblok-js-client';

const pageLoaded = ref(1);
const { data } = await useFetch(`/api/stories`, {
	query: {
		perPage: 10,
		page: pageLoaded,
	},
});

const totalStoryCount = computed(() => data?.value?.total);
const allStories = ref<ISbStoryData[]>(
	(data.value?.stories ?? []) as ISbStoryData[]
);

watch(data, (newData) => {
	allStories.value = [
		...allStories.value,
		...((newData?.stories || []) as ISbStoryData[]),
	];
});

const isLoadedAll = computed(
	() => allStories.value.length >= (totalStoryCount.value ?? 0)
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
