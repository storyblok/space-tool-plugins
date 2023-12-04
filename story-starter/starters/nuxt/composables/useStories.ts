import type { Ref, UnwrapRef } from 'vue';
import type { Stories } from '~/types/story';
import { type ISbStoryData } from 'storyblok-js-client';

type UseStories = (props?: { perPage?: number }) => Promise<{
	data: Ref<Stories | undefined>;
	hasNextPage: Ref<UnwrapRef<boolean>>;
	hasPreviousPage: Ref<UnwrapRef<boolean>>;
	isLoading: Ref<UnwrapRef<boolean>>;
	numberOfPages: Ref<number>;
	currentPage: Ref<number>;
	selectStories: (id: number | number[]) => void;
	isStorySelected: (id: number) => boolean;
	unselectStories: (id: number | number[]) => void;
	selectedStories: Ref<ISbStoryData[]>;
	goToPage: (page: number) => void;
}>;

export const useStories: UseStories = async (props) => {
	const selectedStoryIds = useState<Set<number>>(() => new Set<number>());
	const selectedStories = useState<Map<number, ISbStoryData>>(() => new Map());

	const currentPage = useState(() => 1);

	const { data, pending } = await useFetch('/api/stories', {
		server: false,
		query: {
			perPage: props?.perPage || 25,
			page: currentPage,
		},
	});

	const selectedStoriesInArray = computed(() => [
		...selectedStories.value.values(),
	]);

	const numberOfPages = computed(() => {
		if (data.value !== null) {
			return getNumberOfPages(data.value.total, data.value.perPage);
		}
		return 0;
	});

	const nextPage = computed(() =>
		getNextPage(toValue(numberOfPages), currentPage.value),
	);

	const previousPage = computed(() => getPreviousPage(currentPage.value));
	const hasPreviousPage = computed(() => !!previousPage.value);
	const hasNextPage = computed(() => !!nextPage.value);

	const unselectStories = (id: number | number[]) => {
		const ids = Array.isArray(id) ? id : [id];
		ids.forEach((i) => {
			selectedStoryIds.value.delete(i);
			selectedStories.value.delete(i);
		});
	};

	const selectStories = (id: number | number[]) => {
		const ids = Array.isArray(id) ? id : [id];

		ids.forEach((i) => {
			if (data.value) {
				const selectedStory = data.value.stories.find(
					(story) => story.id === i,
				);
				if (selectedStory) {
					selectedStoryIds.value.add(i);
					selectedStories.value.set(i, selectedStory as ISbStoryData);
				}
			}
		});
	};

	const isStorySelected = (id: number) => selectedStoryIds.value.has(id);

	const goToPage = (page: number) => {
		if (page <= 0 || page > numberOfPages.value) {
			return;
		}
		currentPage.value = page;
	};

	return {
		data: data as Ref<Stories>,
		hasPreviousPage,
		hasNextPage,
		isLoading: pending,
		numberOfPages,
		selectedStories: selectedStoriesInArray,
		isStorySelected,
		selectStories,
		unselectStories,
		currentPage,
		goToPage,
	};
};

//TODO: checkout ERROR handling
//todo: check if perPage not set
const fetchStories = (page: number, perPage?: number): Promise<Stories> =>
	$fetch<Stories>('/api/stories', {
		query: {
			perPage,
			page,
		},
	});

// TODO: extract to utils -> this can be shared across frameworks
const getNextPage = (numberOfPages: number, currentPage: number) => {
	return currentPage < numberOfPages ? currentPage + 1 : undefined;
};

const getPreviousPage = (currentPage: number) => {
	return currentPage > 1 ? currentPage - 1 : undefined;
};

const getNumberOfPages = (totalItems: number, itemsPerPage: number) => {
	return Math.ceil(totalItems / itemsPerPage);
};
