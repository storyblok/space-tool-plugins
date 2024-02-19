export const useSettings = async () => {
	//TODO: pagination?

	const { data, pending, error, refresh } = await useFetch('/api/settings');

	const setSettings = async (body: Record<string, string>) => {
		pending.value = true;

		const mergedSettings = {
			...data.value,
			...body,
		};

		const {
			data: changedData,
			error: changedError,
			pending: changedPending,
		} = await useFetch('/api/settings', {
			method: 'POST',
			body: mergedSettings,
		});

		if (changedError.value) {
			error.value = changedError.value;
		}

		if (changedData.value) {
			data.value = mergedSettings;
		}

		pending.value = changedPending.value;
	};

	return {
		data,
		isLoading: pending,
		error,
		refresh,
		setSettings,
	};
};
