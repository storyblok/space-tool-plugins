<script setup lang="ts">
//TODO: check if user is admin
const { data } = await useFetch('/api/stories');
</script>

<template>
	<NuxtLink class="btn btn-outline" to="/settings">
		<span class="text-base">Settings</span>
		<LucideSettings :size="16" />
	</NuxtLink>

	<div v-if="data">
		<p class="text-sm font-thin text-gray-600">
			Total number of stories: {{ data.total }}
		</p>
		<ul class="mt-4 space-y-4">
			<li v-for="story in data.stories" :key="story.id">
				<span class="text-lg">{{ story.name }}</span>
				<span class="ml-2 text-sm font-thin text-gray-600"
					>(/{{ story.slug }})</span
				>
			</li>
		</ul>
	</div>
</template>
