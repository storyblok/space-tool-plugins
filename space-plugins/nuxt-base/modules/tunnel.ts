import { defineNuxtModule } from '@nuxt/kit';
import { execaCommand } from 'execa';
import { exec, spawn } from 'child_process';
import { execSync } from 'node:child_process';
import { tr } from 'cronstrue/dist/i18n/locales/tr';

export default defineNuxtModule({
	setup(_options, nuxt) {
		const tunnelCommand = process.env.TUNNEL_COMMAND;
		if (process.env.NODE_ENV !== 'development' || !tunnelCommand) {
			return;
		}

		nuxt.hook('listen', async () => {
			console.log(`Starting tunnel...`);

			const command = spawn(tunnelCommand, { shell: true, stdio: 'pipe' });

			command.stderr.on('data', (data) => {
				console.log(data.toString());
				return;
			});

			command.on('error', (err) => {
				console.error('Tunnel error:', err.message);

				return;
			});

			command.stdout.on('data', (data) => {
				console.log(`Tunnel running!`, data.toString());
			});
		});
	},
});

//
// const command = spawn(tunnelCommand);
//
// command.on('error', (err) => {
// 	console.log(err);
// 	console.error('Tunnel error:', err.message);
// });
//
// command.stdout.on('data', (data) => {
// 	console.log(`Tunnel running!`);
// });
// });

// exec(tunnelCommand, (error, stdout, stderr) => {
// 	if (error) {
// 		console.error(`Error: ${error.message}`);
// 		return;
// 	}
// 	if (stderr) {
// 		console.error(`Stderr: ${stderr}`);
// 		return;
// 	}
// 	console.log(`Stdout: ${stdout}`);
// });
