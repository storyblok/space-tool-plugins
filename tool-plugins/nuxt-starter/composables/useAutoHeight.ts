export function useAutoHeight() {
	const nuxtApp = useNuxtApp();
	let observer: MutationObserver | undefined;

	onMounted(() => {
		const observer = new MutationObserver(() => {
			const slug = nuxtApp.$appBridge.getSlug();
			const parentHost = nuxtApp.$appBridge.getParentHost();
			window.parent.postMessage(
				{
					action: 'tool-changed',
					tool: slug,
					event: 'heightChange',
					height: document.body.scrollHeight,
				},
				parentHost,
			);
		});

		observer.observe(document.body, {
			attributes: true,
			childList: true,
			subtree: true,
		});
	});

	onUnmounted(() => {
		if (observer) {
			observer.disconnect();
			observer = undefined;
		}
	});
}
