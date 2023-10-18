export default defineEventHandler(async (event) => {
	if (
		event.path === '/401' &&
		event.headers.get('Referer') === 'https://app.storyblok.com/' &&
		(getCookie(event, 'sb.auth') ?? '').length > 0
	) {
		return await sendRedirect(
			event,
			'https://app.storyblok.com/oauth/app_redirect',
			302
		);
	}
});
