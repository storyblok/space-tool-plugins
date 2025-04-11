<script setup lang="ts">
const { data } = await useFetch('/api/stories');
const alert = useAlert();
</script>

<template>
	<div>
		<div class="mx-20 my-11">
			<Header title="Nuxt Starter">
				<template #icon>
					<LucideTornado class="text-primary" />
				</template>
				<template #description>
					This is a `space-plugin-nuxt-starter`.
				</template>
				<!-- <template #right-action-bar>
					<button class="btn btn-outline">
						<span class="text-base">Settings</span><LucideSettings :size="16" />
					</button>
				</template> -->
			</Header>

			<div v-if="data">
				<p class="mt-10 text-sm font-thin text-gray-600">
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
		</div>
		<BaseAlert
			v-if="alert.state.show"
			:message="alert.state.message"
			:type="alert.state.type"
		/>
	</div>
</template>
