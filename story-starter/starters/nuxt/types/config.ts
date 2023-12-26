import type { DefineComponent } from 'vue';
import type { Story } from './story';

export type StoryAction = {
	label: string;
	icon: DefineComponent;
	handler: (selectedStories: Story[]) => void;
};

export type StoryConfig = {
	actions: StoryAction[];
};
