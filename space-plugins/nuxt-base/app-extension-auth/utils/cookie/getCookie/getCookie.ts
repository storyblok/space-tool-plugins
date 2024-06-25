import http from 'http';

/**
 * RegExp to match all characters to escape in a RegExp.
 */

const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g;

const getPattern = (name: string) =>
	new RegExp(
		'(?:^|;) *' + name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') + '=([^;]*)',
	);

export const getCookie = (
	request: http.IncomingMessage,
	name: string,
): string | undefined => {
	const header = request.headers['cookie'];
	if (!header) {
		return undefined;
	}

	const match = header.match(getPattern(name));
	if (!match) {
		return undefined;
	}

	const value = match[1];
	if (value[0] === '"') {
		return value.slice(1, -1);
	}
	return value;
};
