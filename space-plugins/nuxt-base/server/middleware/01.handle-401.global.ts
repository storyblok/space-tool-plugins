export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();
	if (
		event.path === '/401' &&
		event.headers.get('Referer') === 'https://app.storyblok.com/'
	) {
		return await sendRedirect(
			event,
			appConfig.type === 'tool-plugin'
				? 'https://app.storyblok.com/oauth/tool_redirect'
				: 'https://app.storyblok.com/oauth/app_redirect',
			302,
		);
	}
});
