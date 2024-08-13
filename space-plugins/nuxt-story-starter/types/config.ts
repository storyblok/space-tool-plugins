import type { DefineComponent } from 'vue';
import type { Story } from './story';

export type StoryAction = {
	label: string;
	icon: DefineComponent;
	handler: (params: {
		showLoader: () => void;
		hideLoader: () => void;
		reloadStories: () => void;
		selectedStories: Story[];
	}) => void;
};

export type StoryConfig = {
	actions: StoryAction[];
};

export type StoryConfigGetter = (selectedStories: Story[]) => StoryConfig;
