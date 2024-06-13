export const useAppBridge = () => {
	const eventListener = async (event: MessageEvent) => {
		if (event.data.action === 'validated') {
			const token = event.data.token;
			await $fetch('/api/_bridge_validate', {
				method: 'POST',
				body: JSON.stringify({ token }),
			});
		}
	};

	onUnmounted(() => {
		// @ts-ignore not sure how to solve this
		document.removeEventListener('message', eventListener);
	});

	onMounted(async () => {
		window.addEventListener('message', eventListener);

		const isInIframe = window.top !== window.self;
		if (!isInIframe) {
			return;
		}

		const params = new URLSearchParams(location.search);
		const protocol = params.get('protocol');
		const host = params.get('host');

		window.parent.postMessage(
			{
				action: 'app-changed',
				event: 'validate',
			},
			`${protocol}//${host}`,
		);
	});
};
