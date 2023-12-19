import type { StoryConfig } from '~/types/config';
import type { Story } from '~/types/story';

type StoryConfigGetter = (selectedStories: Story[]) => StoryConfig;

export const defineStoryConfig = (config: StoryConfig | StoryConfigGetter) =>
	config;
