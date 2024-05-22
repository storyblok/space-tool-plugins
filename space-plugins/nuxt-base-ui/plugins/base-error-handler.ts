import { FetchError } from 'ofetch';
import type { Alert, AlertType } from '~/types/alert';
import type { NuxtError } from 'nuxt/app';

const createAlert = () => {
	const alert = reactive<Alert>({
		show: false,
		message: '',
		type: 'info',
	});

	const show = (message: string, type: AlertType) => {
		alert.message = message;
		alert.show = true;
		alert.type = type;
		onTimeoutDismissAlert();
	};

	const success = (message: string) => show(message, 'success');

	const error = (message: string) => show(message, 'error');

	const info = (message: string) => show(message, 'info');

	const warn = (message: string) => show(message, 'warning');

	const onTimeoutDismissAlert = () => {
		setTimeout(() => {
			alert.show = false;
			alert.message = '';
			alert.type = 'info';
		}, 5000);
	};

	return {
		alert,
		show,
		success,
		error,
		info,
		warn,
	};
};

export default defineNuxtPlugin((nuxtApp) => {
	const { alert, show, success, error, info, warn } = createAlert();

	nuxtApp.hook('vue:error', (err: unknown) => {
		console.error(err);

		if (err instanceof FetchError) {
			error(err.data.message);
		} else if (isNuxtError(err as any)) {
			const nuxtError = err as NuxtError;
			error(nuxtError.statusMessage || 'Unknown error');
		} else {
			showError(err as Error);
		}
	});

	return {
		provide: {
			alert: {
				state: alert,
				show,
				success,
				error,
				info,
				warn,
			},
		},
	};
});
