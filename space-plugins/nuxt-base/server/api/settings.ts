export default defineEventHandler(async (event): Promise<any> => {
	const { spaceId, accessToken } = event.context.appSession;
	const appId = env('APP_ID');

	//TODO: guard for none admins
	const storyblokClient = createStoryblokClient(spaceId, accessToken);
	if (event.method === 'GET') {
		//try catch
		const response = await storyblokClient.getSettings(appId);
		if (!isAppDetails(response)) {
			return undefined;
		}

		return response.app_provision.space_level_settings;
	}

	if (event.method === 'POST') {
		//TODO: checkout runValidatedBody
		//try catch
		const settings = await readBody(event);
		if (isKeyValue(settings)) {
			await storyblokClient.putSettings(appId, settings);

			return 'Settings updated!';
		}
	}

	return undefined;
});

const createStoryblokClient = (spaceId: number, accessToken: string) => {
	const putSettings = (appId: string, settings: Record<string, string>) =>
		$fetch(
			`https://mapi.storyblok.com/v1/spaces/${spaceId}/app_provisions/${appId}`,
			{
				method: 'PUT',
				headers: { Authorization: `bearer ${accessToken}` },
				body: {
					space_level_settings: settings,
				},
			},
		);

	const getSettings = (appId: string) =>
		$fetch(
			`https://mapi.storyblok.com/v1/spaces/${spaceId}/app_provisions/${appId}`,
			{
				method: 'GET',
				headers: { Authorization: `bearer ${accessToken}` },
			},
		);

	return {
		getSettings,
		putSettings,
	};
};

//TODO: move
const isAppDetails = (data: unknown): data is AppDetails =>
	isObject(data) &&
	'app_provision' in data &&
	isAppProvisions(data.app_provision);

const isAppProvisions = (data: unknown): data is AppProvisions =>
	isObject(data) &&
	'space_level_settings' in data &&
	isSpaceLevelSettings(data.space_level_settings);

const isSpaceLevelSettings = (data: unknown): data is AppSettings =>
	isKeyValue(data);

const isObject = (data: unknown): data is object =>
	typeof data !== undefined && data !== null && typeof data === 'object';

//TODO: more validation
const isKeyValue = (data: unknown): data is Record<string, string> =>
	isObject(data);
