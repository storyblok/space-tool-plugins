<script setup lang="ts">
import progress from 'nprogress';
import 'nprogress/nprogress.css';

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

// Show top progress bar on page change.
watch(isLoading, () => {
	if (!data.value) {
		// The initial data hasn't been loaded yet.
		// In this case, we show the centered spinner, instead.
		return;
	}
	if (isLoading.value) {
		progress.start();
	} else {
		progress.done();
	}
});

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
	<div
		v-if="!data && isLoading"
		class="absolute inset-0 flex items-center justify-center"
	>
		<LucideLoader2 class="text-primary animate-spin" />
	</div>
	<div v-if="data">
		<p>Number of selected stories {{ selectedStories.length }}</p>
		<button class="btn" @click="selectAll">Select All</button>
		<button class="btn" @click="unselectAll">Unselect All</button>
		<div v-for="(story, index) in data.stories" :key="index">
			<div class="form-control">
				<label class="justify-start gap-2 cursor-pointer label">
					<input
						class="checkbox checkbox-xs"
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
