export default defineNuxtRouteMiddleware((to, from) => {
	if (isValidQuery(from.query) && !isValidQuery(to.query)) {
		return navigateTo({
			...to,
			path: to.path,
			query: {
				...to.query,
				...from.query,
			},
		});
	}

	return;
});

const isValidQuery = (query: unknown): query is Query =>
	typeof query === 'object' &&
	query !== null &&
	(('space_id' in query &&
		typeof query.space_id === 'string' &&
		'user_id' in query &&
		typeof query.user_id === 'string' &&
		'user_is_admin' in query &&
		typeof query.user_is_admin === 'string' &&
		'space_name' in query &&
		typeof query.space_name === 'string' &&
		'space_is_trial' in query &&
		typeof query.space_is_trial === 'string' &&
		'user_lang' in query &&
		typeof query.user_lang === 'string') ||
		('spaceId' in query &&
			typeof query.spaceId === 'string' &&
			'userId' in query &&
			typeof query.userId === 'string'));

type Query =
	| {
			space_id: string;
			user_id: string;
			user_is_admin: string;
			space_name: string;
			space_is_trial: string;
			user_lang: string;
	  }
	| {
			spaceId: string;
			userId: string;
	  };
