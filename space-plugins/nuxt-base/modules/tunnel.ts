import { defineNuxtModule } from '@nuxt/kit';
import { execaCommand } from 'execa';

export default defineNuxtModule({
	setup(_options, nuxt) {
		const tunnelCommand = process.env.TUNNEL_COMMAND;
		if (process.env.NODE_ENV !== 'development' || !tunnelCommand) {
			return;
		}
		nuxt.hook('listen', async () => {
			execaCommand(tunnelCommand);
		});
	},
});
