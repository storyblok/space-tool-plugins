import { defineNuxtModule } from '@nuxt/kit';
import { execaCommand } from 'execa';

export default defineNuxtModule({
	setup(_options, nuxt) {
		const tunnelCommand = process.env.TUNNEL_COMMAND;
		if (process.env.NODE_ENV !== 'development' || !tunnelCommand) {
			return;
		}
		nuxt.hook('listen', async () => {
			// using execa@8.0.1 because we're using a bit lower version of Node.js than what execa@9 requires.
			// https://github.com/sindresorhus/execa/blob/v8.0.1/readme.md
			execaCommand(tunnelCommand);
		});
	},
});
