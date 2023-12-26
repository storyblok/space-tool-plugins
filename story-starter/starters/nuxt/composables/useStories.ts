import type { Ref } from 'vue';
import type { StoriesResponse, Story } from '~/types/story';

type UseStories = (props?: { perPage?: number }) => Promise<{
	data: Ref<StoriesResponse | undefined>;
	hasNextPage: Ref<boolean>;
	hasPreviousPage: Ref<boolean>;
	isLoading: Ref<boolean>;
	numberOfPages: Ref<number>;
	currentPage: Ref<number>;
	slugs: Ref<string[]>;
	setSlugs: (slugs: string[]) => void;
	pushSlug: (slug: string) => void;
	popSlug: () => void;
	selectStories: (id: number | number[]) => void;
	isStorySelected: (id: number) => boolean;
	unselectStories: (id: number | number[]) => void;
	unselectAllStories: () => void;
	selectedStories: Ref<Story[]>;
	goToPage: (page: number) => void;
	error: Ref<Error | null>;
	setQuery: (query: string | undefined) => void;
}>;

export const useStories: UseStories = async (props) => {
	const selectedStoryIds = useState<Set<number>>(() => new Set<number>());
	const selectedStories = useState<Map<number, Story>>(() => new Map());
	const currentPage = useState<number>(() => 1);
	const slugs = useState<string[]>(() => []);
	const query = useState<string | undefined>();

	const setQuery = (newQuery: string | undefined) => {
		query.value = newQuery;
	};

	const slugFilter = computed(() => {
		if (slugs.value.length === 0) {
			return undefined;
		} else {
			return slugs.value.join('/') + '/*';
		}
	});

	const { data, pending, error } = await useFetch<StoriesResponse, Error>(
		'/api/stories',
		{
			onRequest: () => {
				console.log('💡 onRequest of useFetch');
			},
			server: false,
			query: {
				perPage: props?.perPage || 25,
				page: currentPage,
				slug: slugFilter,
				query,
			},
		}
	);

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
		getNextPage(toValue(numberOfPages), currentPage.value)
	);
	const previousPage = computed(() => getPreviousPage(currentPage.value));
	const hasPreviousPage = computed(() => Boolean(previousPage.value));
	const hasNextPage = computed(() => Boolean(nextPage.value));

	const unselectAllStories = () => {
		selectedStories.value.clear();
		selectedStoryIds.value.clear();
	};

	const unselectStories = (id: number | number[]) => {
		const ids = turnNumberToArray(id);

		for (const i of ids) {
			selectedStoryIds.value.delete(i);
			selectedStories.value.delete(i);
		}
	};

	const selectStories = (id: number | number[]) => {
		const ids = turnNumberToArray(id);

		if (data.value === null) {
			return;
		}

		for (const i of ids) {
			const selectedStory = data.value.stories.find((story) => story.id === i);
			if (selectedStory) {
				selectedStoryIds.value.add(i);
				selectedStories.value.set(i, selectedStory);
			}
		}
	};

	const isStorySelected = (id: number) => selectedStoryIds.value.has(id);

	const goToPage = (page: number) => {
		if (page <= 0 || page > numberOfPages.value) {
			return;
		}
		currentPage.value = page;
	};

	const pushSlug = (slug: string) => {
		slugs.value.push(slug);
	};

	const popSlug = () => {
		slugs.value.pop();
	};

	const setSlugs = (newSlugs: string[]) => {
		slugs.value = newSlugs;
	};

	// when slug changes, the page is reset to 1
	watch(
		slugs,
		() => {
			currentPage.value = 1;
		},
		{ deep: true }
	);

	// when page changes, unselect all stories
	watch(currentPage, unselectAllStories);

	return {
		data: data as Ref<StoriesResponse>,
		hasPreviousPage,
		hasNextPage,
		isLoading: pending,
		numberOfPages,
		error,
		selectedStories: selectedStoriesInArray,
		isStorySelected,
		selectStories,
		unselectStories,
		unselectAllStories,
		currentPage,
		goToPage,
		slugs,
		pushSlug,
		popSlug,
		setSlugs,
		setQuery,
	};
};

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

const turnNumberToArray = (num: number | number[]) =>
	Array.isArray(num) ? num : [num];
