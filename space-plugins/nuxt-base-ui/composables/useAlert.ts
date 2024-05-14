export const useAlert = () => {
	const { $alert } = useNuxtApp();
	return $alert;
};
