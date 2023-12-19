import type { Story } from '~/types/story';
import config from '../stories.config';
import type { StoryConfig } from '~/types/config';

type UseConfig = (props: { selectedStories: Ref<Story[]> }) => Ref<StoryConfig>;

export const useConfig: UseConfig = ({ selectedStories }) => {
	const resolvedConfig = ref<StoryConfig>(
		typeof config === 'function' ? config(selectedStories.value) : config
	);

	if (typeof config === 'function') {
		watch(selectedStories, () => {
			resolvedConfig.value =
				typeof config === 'function' ? config(selectedStories.value) : config;
		});
	}

	return resolvedConfig;
};
