import type { AppSession } from '@storyblok/app-extension-auth';

declare module 'h3' {
	interface H3EventContext {
		appSession: AppSession;
	}
}

export default {};
