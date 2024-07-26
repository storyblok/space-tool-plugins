export const useStoryContext = () => {
	const nuxtApp = useNuxtApp();
	const data = ref<StoryContext>();
	const status = ref<'idle' | 'pending' | 'success'>('idle');

	const listener = (event: MessageEvent<StoryContextWithAction>) => {
		const { action, ...rest } = event.data;
		if (action === 'get-context') {
			data.value = rest;
			status.value = 'success';
		}
	};

	const refresh = () => {
		const slug = nuxtApp.$appBridge.getSlug();
		const parentHost = nuxtApp.$appBridge.getParentHost();
		status.value = 'pending';
		window.parent.postMessage(
			{
				action: 'tool-changed',
				tool: slug,
				event: 'getContext',
			},
			parentHost,
		);
	};

	onMounted(() => {
		window.addEventListener('message', listener);
		refresh();
	});

	onUnmounted(() => {
		window.removeEventListener('message', listener);
	});

	return { status, data, refresh };
};
