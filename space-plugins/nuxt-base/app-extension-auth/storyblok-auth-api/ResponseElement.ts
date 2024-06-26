/**
 * This object describes an HTTP response in a framework-agnostic way.
 * The idea is to create one function that parses an incoming HTTP message into a `ResponseElement`.
 * This `ResponseElement` is then fed into a _reconciler_ that writes the required changes into an HTTP response.
 */
export type ResponseElement = {
	type: 'success' | 'error' | 'configuration-error';
	setCookies?: CookieElement[];
	redirectTo?: string;
	message?: string;
};

/**
 * Descibes the cookies to be set or removed.
 * @param name the name of the cookie to be set
 * @param value the value of the cookie to be set. When `undefined`, the cookie should be expired.
 */
export type CookieElement = {
	name: string;
	value: string | object | undefined;
};
