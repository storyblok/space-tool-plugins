export default defineEventHandler(async (event) => {
	if (
		event.path === '/401' &&
		event.headers.get('Referer') === 'https://app.storyblok.com/'
	) {
		console.log('💡 handling /401 - (1)');
		return await sendRedirect(
			event,
			'https://app.storyblok.com/oauth/app_redirect',
			302,
		);
	}

	if (event.path === '/401') {
		console.log('💡 handling /401 - (2)', event.headers.get('Referer'));
	}
});
