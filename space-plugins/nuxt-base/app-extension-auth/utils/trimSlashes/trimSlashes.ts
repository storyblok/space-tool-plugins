/**
 * Removes leading and trailing slashes (`/`) from a string.
 * @param slugs
 */
export const trimSlashes = (slugs: string): string =>
	slugs.match(/^\/*(.*?)\/*$/)?.[1] ?? '';
