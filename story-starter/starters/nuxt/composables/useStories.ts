import type { Ref, UnwrapRef } from 'vue';
import type { Stories } from '~/types/story';

//TODO: think about selecting all stories
type UseStories = (props?: { perPage?: number }) => Promise<{
	data: Ref<Stories | undefined>;
	hasNextPage: Ref<UnwrapRef<boolean>>;
	hasPreviousPage: Ref<UnwrapRef<boolean>>;
	isLoading: Ref<UnwrapRef<boolean>>;
	numberOfPages: Ref<number>;
	currentPage: Ref<number>;
	selectStory: (id: number) => void;
	unselectStory: (id: number) => void;
	selectedStories: Ref<number[]>;
	goToPage: (page: number) => void;
}>;

export const useStories: UseStories = async (props) => {
	const data = useState<undefined | Stories>(() => undefined);
	const selectedStories = useState<number[]>(() => []);
	const hasNextPage = useState(() => false);
	const hasPreviousPage = useState(() => false);
	const numberOfPages = useState(() => 0);
	const isLoading = useState(() => false);
	const currentPage = useState(() => 1);

	const getStories = async () => {
		isLoading.value = true;

		const storyRes = await fetchStories(currentPage.value, props?.perPage);

		if (storyRes === null) {
			isLoading.value = false;
			return;
		}

		numberOfPages.value = getNumberOfPages(storyRes.total, storyRes.perPage);

		const nextPage = computed(() =>
			getNextPage(toValue(numberOfPages), currentPage.value),
		);
		const previousPage = computed(() => getPreviousPage(currentPage.value));

		hasPreviousPage.value = !!previousPage.value;
		hasNextPage.value = !!nextPage.value;
		data.value = storyRes as Stories;
		isLoading.value = false;
	};

	const unselectStory = (id: number) => {
		const filteredStories = selectedStories.value.filter(
			(selectedStory) => selectedStory !== id,
		);

		if (filteredStories) {
			selectedStories.value = filteredStories;
		}
	};

	const selectStory = (id: number) => {
		const alreadySelected = selectedStories.value.includes(id);
		if (!alreadySelected) {
			selectedStories.value.push(id);
		}
	};

	const goToPage = (page: number) => {
		currentPage.value = page;
	};

	// watch(
	// 	() => currentPage.value,
	// 	() => {
	// 		console.log('watcher');
	// 	},
	// );

	onMounted(() => getStories());

	return {
		data,
		hasPreviousPage,
		hasNextPage,
		isLoading,
		numberOfPages,
		selectedStories,
		selectStory,
		unselectStory,
		currentPage,
		goToPage,
	};
};

//TODO: checkout ERROR handling
//todo: check if perpage not set
const fetchStories = (page: number, perPage?: number) =>
	$fetch('/api/stories', {
		query: {
			perPage,
			page,
		},
	});

const getNextPage = (numberOfPages: number, currentPage: number) => {
	return currentPage < numberOfPages ? currentPage + 1 : undefined;
};

const getPreviousPage = (currentPage: number) => {
	return currentPage > 1 ? currentPage - 1 : undefined;
};

const getNumberOfPages = (totalItems: number, itemsPerPage: number) => {
	return Math.ceil(totalItems / itemsPerPage);
};
