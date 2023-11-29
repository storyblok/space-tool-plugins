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
	nrOfPages: Ref<number>;
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
	const nrOfPages = useState(() => 0);
	const isLoading = useState(() => false);

	const getStories = async () => {
		isLoading.value = true;
		const currentPage = props?.page ? toValue(props.page) : 1;

		const storyResponse = await fetchStories(currentPage, perPage);

		if (storyResponse === null) {
			isLoading.value = false;
			return;
		}

		nrOfPages.value = getNrOfPages(storyResponse.total, perPage);

		const nextPage = getNextPage(toValue(nrOfPages), currentPage);
		const previousPage = getPreviousPage(currentPage);

		hasPreviousPage.value = !!previousPage;
		hasNextPage.value = !!nextPage;
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

	watchEffect(() => getStories());

	return {
		data,
		hasPreviousPage,
		hasNextPage,
		isLoading,
		nrOfPages,
		selectedStories,
		selectStory,
		unselectStory,
	};
};

//TODO: checkout ERROR handling
const fetchStories = (page: number, perPage: number) =>
	fetch(
		`https://bs-custom-app.ngrok.io/api/stories?perPage=${perPage}&page=${page}`,
		{
			method: 'GET',
		},
	).then((res) => res.json());

const getNextPage = (nrOfPages: number, currentPage: number) => {
	return currentPage < nrOfPages ? currentPage + 1 : undefined;
};

const getPreviousPage = (currentPage: number) => {
	return currentPage > 1 ? currentPage - 1 : undefined;
};

const getNrOfPages = (totalItems: number, itemsPerPage: number) => {
	return Math.ceil(totalItems / itemsPerPage);
};
