<script setup lang="ts">
import { useStories } from '~/utils/composable';

const { data, fetchNextPage, hasNextPage, isLoading } = await useStories();
</script>

<template>
	<span v-if="isLoading">Loading...</span>
	<div v-if="!isLoading && data">
		<div v-for="(item, index) in data.stories" :key="index">
			<pre>{{ item.name }} (/{{ item.slug }})</pre>
		</div>
	</div>
	<button @click="fetchNextPage" v-if="hasNextPage">load more</button>
</template>
