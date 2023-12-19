//draft for future actions implementations
export type StoryConfig = {
	actions: {
		label: string;
		handler: (selectedStories: any) => void;
	}[];
};
