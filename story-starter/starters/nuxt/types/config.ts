import type { DefineComponent } from 'vue';

export type StoryAction = {
	label: string;
	icon: DefineComponent;
	handler: (selectedStories: any) => void;
};

export type StoryConfig = {
	actions: StoryAction[];
};
