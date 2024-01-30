import { type ISbStoryData } from 'storyblok-js-client';

export type StoriesResponse = {
	stories: Story[];
	perPage: number;
	total: number;
};

export type Story = ISbStoryData & {
	// these are missing from `ISbStoryData`
	is_folder: boolean;
	content_type: string;
	updated_at?: string;
	last_author: {
		id: number;
		userid: string;
		friendly_name: string;
		avatar: string;
	};
};
