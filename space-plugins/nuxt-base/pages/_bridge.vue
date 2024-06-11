<script setup lang="ts">
const referer = useRequestHeader('referer');

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
	document.removeEventListener('message', eventListener);
});

onMounted(async () => {
	window.addEventListener('message', eventListener);

	const isInIframe = window.top !== window.self;
	if (!isInIframe) {
		return;
	}

	window.parent.postMessage(
		{
			action: 'app-changed',
			event: 'validate',
		},
		referer || 'https://app.storyblok.com',
	);
});
</script>
