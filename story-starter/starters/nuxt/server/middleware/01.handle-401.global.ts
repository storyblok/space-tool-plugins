export default defineEventHandler(async (event) => {
	if (
		event.path === '/401' &&
		event.headers.get('Referer') === 'https://app.storyblok.com/'
	) {
		return await sendRedirect(
			event,
			'https://app.storyblok.com/oauth/app_redirect',
			302
		);
	}
});
