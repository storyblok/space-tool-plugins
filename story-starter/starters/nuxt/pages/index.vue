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
	error,
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
	<span v-if="error">Error: {{ error.message }}</span>
	<div v-if="data">
		<p>Number of selected stories {{ selectedStories.length }}</p>
		<button class="btn" @click="selectAll">Select All</button>
		<button class="btn" @click="unselectAll">Unselect All</button>
		<div v-for="(story, index) in data.stories" :key="index">
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-2">
					<input
						class="checkbox"
						type="checkbox"
						:id="story.id.toString()"
						:name="story.id.toString()"
						@change="(e) => onChange(e, story.id)"
						:checked="isStorySelected(story.id)"
					/>
					<label class="label-text" :for="story.id.toString()"
						>{{ story.name }} (/{{ story.slug }})</label
					>
				</label>
			</div>
		</div>

		<p>Current Page {{ currentPage }}</p>

		<div class="join">
			<button
				class="btn btn-ghost btn-sm join-item"
				@click="goToPage(currentPage - 1)"
				:disabled="!hasPreviousPage"
			>
				Previous Page
			</button>
			<div v-for="(_item, idx) in new Array(numberOfPages)">
				<button
					class="btn btn-ghost btn-sm join-item"
					:disabled="currentPage === idx + 1"
					@click="goToPage(idx + 1)"
				>
					{{ idx + 1 }}
				</button>
			</div>
			<button
				class="btn btn-ghost btn-sm join-item"
				@click="goToPage(currentPage + 1)"
				:disabled="!hasNextPage"
			>
				Next Page
			</button>
		</div>
	</div>
</template>
