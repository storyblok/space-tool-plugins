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

		const storyResponse = await fetchStories(currentPage.value, props?.perPage);

		if (storyResponse === null) {
			isLoading.value = false;
			return;
		}

		numberOfPages.value = getNumberOfPages(
			storyResponse.total,
			storyResponse.perPage,
		);

		//Question: should this be extracted to outside off getStories?
		const nextPage = computed(() =>
			getNextPage(toValue(numberOfPages), currentPage.value),
		);
		const previousPage = computed(() => getPreviousPage(currentPage.value));

		hasPreviousPage.value = !!previousPage.value;
		hasNextPage.value = !!nextPage.value;
		data.value = storyResponse;
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

	onMounted(() => getStories());

	watch(currentPage, () => {
		getStories();
	});

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
