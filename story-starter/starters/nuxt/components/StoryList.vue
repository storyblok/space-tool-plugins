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
	unselectAllStories,
	currentPage,
	slugs,
	pushSlug,
	setSlugs,
	isStorySelected,
	goToPage,
	setQuery,
	reloadStories,
} = await useStories({ perPage: 25 });

const config = useConfig({
	selectedStories,
});

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

const updateStorySelection = (id: number, checked: boolean) => {
	if (checked) {
		selectStories(id);
	} else {
		unselectStories(id);
	}
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
		<SearchBar :set-query="setQuery" />
		<Breadcrumbs :slugs="slugs" :set-slugs="setSlugs" class="px-5 py-2 mt-4" />
		<StoryActionBar
			v-if="selectedStories.length > 0"
			class="mt-4"
			:actions="config.actions"
			:selected-stories="selectedStories"
			:unselect-all-stories="unselectAllStories"
			:reload-stories="reloadStories"
		/>
		<table class="w-full mt-4 overflow-hidden rounded-md table-fixed">
			<StoryListHeader
				:stories="data.stories"
				:is-story-selected="isStorySelected"
				:select-all="selectAll"
				:unselect-all="unselectAll"
			/>
			<tbody>
				<StoryListItem
					v-for="(story, index) in data.stories"
					:key="index"
					:story="story"
					:checked="isStorySelected(story.id)"
					:enter-folder="pushSlug"
					:update-story-selection="updateStorySelection"
					class="even:bg-gray-50"
				/>
			</tbody>
		</table>
		<div class="flex justify-center mt-8">
			<Pagination
				:go-to-page="goToPage"
				:current-page="currentPage"
				:has-previous-page="hasPreviousPage"
				:has-next-page="hasNextPage"
				:number-of-pages="numberOfPages"
			/>
		</div>
	</div>
</template>
