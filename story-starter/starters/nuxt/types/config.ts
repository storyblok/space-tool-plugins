export type StoryAction = {
	label: string;
	handler: (selectedStories: any) => void;
};

export type StoryConfig = {
	actions: StoryAction[];
};
