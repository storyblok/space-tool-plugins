<script setup>
const route = useRoute();

const { data } = await useFetch(`/api/stories`, {
	query: {
		spaceId: route.query.spaceId,
		userId: route.query.userId,
	},
});
</script>

<template>
	<div>
		<div v-for="(item, index) in data.stories" :key="index">
			<pre>{{ item.name }} (/{{ item.slug }})</pre>
		</div>
	</div>
</template>
