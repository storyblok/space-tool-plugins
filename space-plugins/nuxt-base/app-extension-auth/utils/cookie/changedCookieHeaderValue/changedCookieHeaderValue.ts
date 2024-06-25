// TODO URL encode the value
/**
 * Createa
 * @param name
 * @param value
 */
export const changedCookieHeaderValue = (name: string, value: string) =>
	`${name}=${value}; path=/; samesite=none; secure; httponly`;
