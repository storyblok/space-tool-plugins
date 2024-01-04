import type { StoryConfig, StoryConfigGetter } from '~/types/config';

export const defineStoryConfig = (config: StoryConfig | StoryConfigGetter) =>
	config;
