<script setup lang="ts">
// BaseAlert
const alert = useAlert();
alert.success('Hello, World!');

// BaseModal
const modalRef = ref<InstanceType<typeof BaseModal>>();
const showModal = () => modalRef.value?.show();
const closeModal = () => modalRef.value?.close();
const onConfirm = () => {
	// Do some action
	closeModal();
};
</script>

<template>
	<BaseAlert
		v-if="alert.state.show"
		:message="alert.state.message"
		:type="alert.state.type"
	/>

	<button @click="showModal">Open Modal</button>
	<BaseModal
		ref="modalRef"
		title="Are you sure?"
		message="Would you like to continue?"
	>
		<template #actions>
			<menu class="modal-action px-8 py-6 m-0 bg-gray-100">
				<button
					class="btn btn-tertiary"
					title="Close the modal and cancel the action"
					@click.prevent="closeModal"
				>
					Cancel
				</button>
				<button
					class="btn btn-primary"
					title="Confirm the action"
					@click.prevent="onConfirm"
				>
					Confirm
				</button>
			</menu>
		</template>
	</BaseModal>
</template>
