export default defineEventHandler(async (event) => {
	const { spaceId, accessToken } = event.context.appSession;
	const apiHost = 'https://mapi.storyblok.com';
	const url = `${apiHost}/v1/oauth/space_info`;
	console.log('💡 accessToken', accessToken);
	const response = await $fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	console.log('💡 response', response.space);

	return { hello: 'world', response };
});
