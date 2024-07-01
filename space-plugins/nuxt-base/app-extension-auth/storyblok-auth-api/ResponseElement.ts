/**
 * This object describes an HTTP response in a framework-agnostic way.
 * The idea is to create one function that parses an incoming HTTP message into a `ResponseElement`.
 * This `ResponseElement` is then fed into a _reconciler_ that writes the required changes into an HTTP response.
 */
export type ResponseElement = {
	type: 'success' | 'error' | 'configuration-error';
	sessions?: SessionElement[];
	redirectTo?: string;
	message?: string;
};

/**
 * Describes the cookies to be set or removed.
 * @param name the name of the cookie to be set
 * @param value the value of the cookie to be set. When `undefined`, the cookie should be expired.
 */
export type SessionElement = {
	name: string;
	value: string | object | undefined;
};
