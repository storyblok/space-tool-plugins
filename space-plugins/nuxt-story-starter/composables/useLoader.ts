export const useLoader = () => {
	const fullScreenLoader = inject<Ref<boolean>>('fullScreenLoader');

	const showLoader = () => {
		if (fullScreenLoader) {
			fullScreenLoader.value = true;
			document.body.style.overflowY = 'hidden';
		}
	};

	const hideLoader = () => {
		if (fullScreenLoader) {
			fullScreenLoader.value = false;
			document.body.style.overflowY = 'initial';
		}
	};

	return {
		isShowingLoader: fullScreenLoader,
		showLoader,
		hideLoader,
	};
};
