//draft for future actions implementations
type StoryConfig = {
	actions: {
		label: string;
		handler: (selectedStories: any) => void;
	}[];
};

export function defineStoryConfig(config: StoryConfig): StoryConfig {
	return config;
}
