//draft for future actions implementations
type StoryConfig = {
	actions: {
		label: string;
		handler: (selectedStories: any) => void;
	}[];
};

export const defineStoryConfig = (config: StoryConfig): StoryConfig => config;
