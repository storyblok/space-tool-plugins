import { AuthHandlerParams } from '../storyblok-auth-api';

const defaultCookieName = 'sb.auth';
export const authCookieName = (params: Pick<AuthHandlerParams, 'cookieName'>) =>
	params.cookieName ?? defaultCookieName;
