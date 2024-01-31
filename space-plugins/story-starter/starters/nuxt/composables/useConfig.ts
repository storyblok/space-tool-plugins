import type { Story } from '~/types/story';
import config from '../stories.config';
import type { StoryConfig, StoryConfigGetter } from '~/types/config';

type UseConfig = (props: { selectedStories: Ref<Story[]> }) => Ref<StoryConfig>;

export const useConfig: UseConfig = ({ selectedStories }) => {
	const resolvedConfig = ref<StoryConfig>(
		typeof config === 'function' ? config(selectedStories.value) : config
	);

	if (typeof config === 'function') {
		watch(selectedStories, () => {
			// at this point, `config` is always a function, not an object.
			resolvedConfig.value = (config as StoryConfigGetter)(
				selectedStories.value
			);
		});
	}

	return resolvedConfig;
};
