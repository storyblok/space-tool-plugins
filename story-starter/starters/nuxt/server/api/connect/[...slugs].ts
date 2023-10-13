import { authHandler } from '@storyblok/app-extension-auth';
import { authHandlerParams } from '~/server/utils/auth';

export default defineEventHandler((event) =>
	authHandler(authHandlerParams)(event.node.req, event.node.res)
);
