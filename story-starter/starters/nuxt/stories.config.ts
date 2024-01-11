import { LucideSettings, LucideTrash } from 'lucide-vue-next';
import { defineStoryConfig } from '~/shared/defineStoryConfig';
import type { StoryAction } from './types/config';

// pass a function to generate config based on selected stories
export default defineStoryConfig((selectedStories) => {
	const actions: StoryAction[] = [];

	if (selectedStories.length === 1) {
		actions.push({
			label: 'Settings',
			icon: LucideSettings,
			handler: ({ selectedStories }) => {
				console.log('💡 opening settings modal', selectedStories);
			},
		});
	}

	actions.push({
		label: 'Delete',
		icon: LucideTrash,
		handler: async ({
			selectedStories,
			showLoader,
			hideLoader,
			reloadStories,
		}) => {
			if (
				window.confirm(
					`Do you want to delete ${selectedStories.length} stories?`
				)
			) {
				console.log(
					`You can perform any action on these stories`,
					selectedStories
				);
				showLoader();
				await sleep(1500);
				hideLoader();
				reloadStories();
			}
		},
	});

	return { actions };
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

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
