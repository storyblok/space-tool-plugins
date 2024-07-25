import type { Plugin } from 'vite';
import { execaCommand } from 'execa';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	nitro: {
		imports: {
			dirs: ['./utils', './server/utils'],
		},
	},
	vite: {
		plugins: [runTunnelPlugin()],
	},
});

function runTunnelPlugin(): Plugin {
	let isBuildingClientSideOfNuxt = false;
	const tunnelCommand = process.env.TUNNEL_COMMAND;
	return {
		name: 'run-tunnel',
		apply: 'serve',
		config(config) {
			isBuildingClientSideOfNuxt = config.build?.ssr !== true;
		},
		buildStart() {
			if (tunnelCommand && isBuildingClientSideOfNuxt) {
				// using execa@8.0.1 because we're using a bit lower version of Node.js than what execa@9 requires.
				// https://github.com/sindresorhus/execa/blob/v8.0.1/readme.md
				execaCommand(tunnelCommand);
			}
		},
	};
}
