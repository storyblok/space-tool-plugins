<script setup lang="ts">
import type { AlertType } from '~/types/alert';

defineProps<{
	type: AlertType;
	message: string | undefined;
}>();

const getAlertStyleByType = (type: AlertType) => {
	switch (type) {
		case 'success':
			return 'alert-success border-success-light';
		case 'error':
			return 'alert-error border-error-light';
		case 'warning':
			return 'alert-warning border-warning-light';
		case 'info':
			return 'alert-info border-info-light';
		default:
			return '';
	}
};
</script>

<template>
	<div
		role="alert"
		class="alert fixed top-5 left-1/2 -translate-x-1/2 w-72 grid grid-cols-[24px,auto] items-start border"
		:class="getAlertStyleByType(type)"
	>
		<div
			class="w-4 h-4 rounded justify-self-center grid place-items-center"
			:class="{
				'bg-success-dark': type === 'success',
				'bg-error-dark': type === 'error',
				'bg-warning-dark': type === 'warning',
				'bg-info-dark': type === 'info',
			}"
		>
			<svg
				v-if="type === 'success'"
				xmlns="http://www.w3.org/2000/svg"
				width="8"
				height="7"
				viewBox="0 0 8 7"
				fill="none"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M2.48039 5.84065C2.87092 6.23118 3.50408 6.23118 3.89461 5.84065L7.66052 2.07474C8.05105 1.68421 8.05105 1.05105 7.66052 0.660523C7.27 0.269999 6.63683 0.269999 6.24631 0.660524L3.1875 3.71933L1.94119 2.47302C1.55067 2.0825 0.917501 2.0825 0.526977 2.47302C0.136452 2.86355 0.136453 3.49671 0.526977 3.88724L2.48039 5.84065Z"
					fill="white"
				/>
			</svg>
			<svg
				v-else-if="type === 'error'"
				xmlns="http://www.w3.org/2000/svg"
				width="2"
				height="8"
				viewBox="0 0 2 8"
				fill="none"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8C1.55228 8 2 7.55228 2 7C2 6.44772 1.55228 6 1 6ZM1 5C1.55228 5 2 4.55228 2 4L2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1L0 4C0 4.55228 0.447715 5 1 5Z"
					fill="white"
				/>
			</svg>
			<svg
				v-else-if="type === 'warning'"
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="9"
				viewBox="0 0 10 9"
				fill="none"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.10556 0.788856C4.47408 0.0518076 5.52589 0.0518056 5.89441 0.788854L9.27638 7.55278C9.60883 8.21769 9.12533 9 8.38195 9H1.61802C0.874638 9 0.391142 8.21769 0.723593 7.55279L4.10556 0.788856ZM4.49999 3H5.49999V6H4.49999V3ZM5.49999 7H4.49999V8H5.49999V7Z"
					fill="white"
				/>
			</svg>
			<svg
				v-else-if="type === 'info'"
				xmlns="http://www.w3.org/2000/svg"
				width="2"
				height="8"
				viewBox="0 0 2 8"
				fill="none"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2ZM1 3C0.447715 3 0 3.44772 0 4V7C0 7.55228 0.447715 8 1 8C1.55228 8 2 7.55228 2 7V4C2 3.44772 1.55228 3 1 3Z"
					fill="white"
				/>
			</svg>
		</div>
		<span class="text-sm">{{ message }}</span>
	</div>
</template>
