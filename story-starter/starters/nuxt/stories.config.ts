import { defineStoryConfig } from '~/shared/defineStoryConfig';

// pass a function to generate config based on selected stories
export default defineStoryConfig((selectedStories) => {
	if (selectedStories.some((story) => story.is_folder)) {
		return {
			actions: [
				{
					label: 'Folder & Story action',
					handler: (selectedStories) => {
						console.log('💡 stories', selectedStories);
					},
				},
				{
					label: 'Another action',
					handler: (selectedStories) => {
						console.log('💡 stories', selectedStories);
					},
				},
			],
		};
	} else {
		return {
			actions: [
				{
					label: 'Non-folder stories action',
					handler: (selectedStories) => {
						console.log('💡 stories', selectedStories);
					},
				},
				{
					label: 'Another action',
					handler: (selectedStories) => {
						console.log('💡 stories', selectedStories);
					},
				},
			],
		};
	}

	return {
		actions: [
			{
				label: 'Translate',
				handler: (selectedStories) => {},
			},
		],
	};
});

// or a simple object config
// export default defineStoryConfig({
// 	actions: [
// 		{
// 			label: 'Translate',
// 			handler: (selectedStories) => {},
// 		},
// 	],
// });
