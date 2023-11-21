import type { ISbStoryData } from 'storyblok-js-client';
import type { Ref, UnwrapRef } from 'vue';

type Pagination = {
	currentPage: number;
	nextPage: undefined | number;
	perPage: number;
};

type UseStories = (props?: { perPage: number }) => Promise<{
	data: Ref<Stories | undefined>;
	fetchNextPage: () => Promise<void>;
	hasNextPage: Ref<UnwrapRef<boolean>>;
	isLoading: Ref<UnwrapRef<boolean>>;
}>;

type Stories = {
	stories: ISbStoryData[];
	perPage: number;
	total: number;
};

export const useStories: UseStories = async (props) => {
	const data = useState<undefined | Stories>('data', () => undefined);
	const pagination = useState<Pagination>('pagination', () => ({
		currentPage: 1,
		nextPage: undefined,
		perPage: props?.perPage || 10,
	}));
	const hasNextPage = ref<boolean>(false);
	const isLoading = ref<boolean>(false);

	const getStories = async () => {
		isLoading.value = true;

		//TODO: error handling
		const res = await fetchStories(
			pagination.value.currentPage,
			pagination.value.perPage,
		);

		const nextPage = getNextPage(
			pagination.value.currentPage,
			res.total,
			pagination.value.perPage,
		);

		hasNextPage.value = !!nextPage;
		pagination.value.nextPage = nextPage;
		data.value = res;
		isLoading.value = false;
	};

	const fetchNextPage = async () => {
		if (pagination.value.nextPage === null) {
			return;
		}

		pagination.value.currentPage++;
		await getStories();
	};

	onMounted(() => getStories());

	return {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
	};
};

//TODO: checkout useAsyncData or useFetch
const fetchStories = (page: number, perPage: number = 10) =>
	fetch(
		`https://bs-custom-app.ngrok.io/api/stories?perPage=${perPage}&page=${page}`,
		{
			method: 'GET',
		},
	).then((res) => res.json());

const getNextPage = (
	currentPage: number,
	totalItems: number,
	itemsPerPage: number,
) => {
	const differenceBetweenNext = totalItems - currentPage * itemsPerPage;
	return differenceBetweenNext > 0 ? currentPage + 1 : undefined;
};
