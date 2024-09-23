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
		typeof query.user_id === 'string') ||
		('spaceId' in query &&
			typeof query.spaceId === 'string' &&
			'userId' in query &&
			typeof query.userId === 'string'));

type Query =
	| {
			space_id: string;
			user_id: string;
	  }
	| {
			spaceId: string;
			userId: string;
	  };
