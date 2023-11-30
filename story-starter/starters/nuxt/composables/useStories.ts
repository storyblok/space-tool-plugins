import type { ISbStoryData } from 'storyblok-js-client';
import type { Ref, UnwrapRef } from 'vue';

//TODO: think about selecting all stories
type UseStories = (props?: {
	perPage?: number;
	page?: number | Ref<number>;
}) => Promise<{
	data: Ref<Stories | undefined>;
	hasNextPage: Ref<UnwrapRef<boolean>>;
	hasPreviousPage: Ref<UnwrapRef<boolean>>;
	isLoading: Ref<UnwrapRef<boolean>>;
	numberOfPages: Ref<number>;
	selectStory: (id: number) => void;
	unselectStory: (id: number) => void;
	selectedStories: Ref<number[]>;
}>;

type Stories = {
	stories: ISbStoryData[];
	perPage: number;
	total: number;
};

export const useStories: UseStories = async (props) => {
	const perPage = props?.perPage || 10;
	const data = useState<undefined | Stories>(() => undefined);
	const selectedStories = useState<number[]>(() => []);
	const hasNextPage = useState(() => false);
	const hasPreviousPage = useState(() => false);
	const numberOfPages = useState(() => 0);
	const isLoading = useState(() => false);

	const getStories = async () => {
		isLoading.value = true;
		const currentPage = props?.page ? toValue(props.page) : 1;

		const { data: storyRes } = await fetchStories(currentPage, perPage);

		if (storyRes.value === null) {
			isLoading.value = false;
			return;
		}

		numberOfPages.value = getNumberOfPages(storyRes.value.total, perPage);

		const nextPage = getNextPage(toValue(numberOfPages), currentPage);
		const previousPage = getPreviousPage(currentPage);

		hasPreviousPage.value = !!previousPage;
		hasNextPage.value = !!nextPage;
		data.value = storyRes.value as Stories;
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

	watchEffect(() => getStories());

	return {
		data,
		hasPreviousPage,
		hasNextPage,
		isLoading,
		numberOfPages,
		selectedStories,
		selectStory,
		unselectStory,
	};
};

//TODO: checkout ERROR handling
const fetchStories = (page: number, perPage: number) =>
	useFetch('/api/stories?perPage', {
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
