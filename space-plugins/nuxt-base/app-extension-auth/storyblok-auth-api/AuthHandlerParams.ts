import type { IncomingMessage, ServerResponse } from 'node:http';

export type AuthHandlerParams = {
	/*
	 * The client ID is a public identifier for your apps. Find the Client ID in the app settings on Storyblok.
	 */
	clientId: string;
	/*
	 * The client secret is a secret known only to the application and the authorization server.
	 * Find the client secret in the app settings on Storyblok.
	 *
	 * Load it into the application as an environmental variable.
	 * It must be kept confidential.
	 */
	clientSecret: string;
	/*
	 * The base URL specifies the base URL to use for all relative authentication API endpoints created by authHandler().
	 * The base URL must be absolute and secure with https.
	 *
	 * For example, the base URL `https://my-app.my-domain.com/` will create the following api endpoints
	 *  - `https://my-app.my-domain.com/storyblok` for initiating the authentication flow
	 *  - `https://my-app.my-domain.com/storyblok/callback` as the OAuth2 callback URL
	 */
	baseUrl: string;
	/*
	 * The name of the cookie that contains the session data.
	 */
	cookieName?: string;
	/*
	 * Specifies the URL that the user agent will be redirected to after a _successful_ authentication flow.
	 *
	 * Defaults to `"/"`.
	 */
	successCallback?: string;
	/*
	 * Specifies the URL that the user agent will be redirected to after an _unsuccessful_ authentication flow.
	 *
	 * If omitted, the user agent will receive a 401 response without redirect.
	 */
	errorCallback?: string;
	/**
	 * Specifies the partial URL that is located between the baseUrl and the
	 *  authentication API endpoints.
	 *
	 * For example
	 * - `baseUrl: "https://app.com"`
	 * - `endpointPrefix: "api/authenticate"`
	 *
	 * will result in the endpoints
	 *
	 *  - `https://my-app.my-domain.com/api/authenticate/storyblok` for initiating the authentication flow
	 *  - `https://my-app.my-domain.com/api/authenticate/storyblok/callback` as the OAuth2 callback URL
	 */
	endpointPrefix: string | undefined; // To make explicit, do not make this optional.
};

export type Adapter = {
	getItem: (params: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
	}) => string | undefined | Promise<string | undefined>;

	setItem: (params: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
		value: string;
	}) => void | Promise<void>;

	removeItem: (params: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
	}) => Promise<void>;

	hasItem: (params: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
	}) => boolean | Promise<boolean>;
};

export type InternalAdapter = {
	getItem: (key: string) => string | undefined | Promise<string | undefined>;
	setItem: (params: { key: string; value: string }) => void | Promise<void>;
	removeItem: (key: string) => Promise<void>;
	hasItem: (key: string) => boolean | Promise<boolean>;
};
