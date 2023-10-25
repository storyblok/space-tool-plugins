<script setup lang="ts">
const { data } = await useFetch(`/api/stories`);
</script>

<template>
	<div v-if="data">
		<div v-for="(item, index) in data.stories" :key="index">
			<pre>{{ item.name }} (/{{ item.slug }})</pre>
		</div>
	</div>
</template>
