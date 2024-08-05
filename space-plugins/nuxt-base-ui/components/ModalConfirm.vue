<script setup lang="ts">
defineProps<{
	title?: string;
	message?: string;
}>();

const emit = defineEmits(['confirmed', 'canceled']);

const modalConfirmRef = ref<InstanceType<typeof BaseModal>>();

const show = () => modalConfirmRef.value?.show();
const close = () => modalConfirmRef.value?.close();

defineExpose({ show, close });

const onConfirmClicked = () => {
	emit('confirmed');
	close();
};

const onCancelClicked = () => {
	emit('canceled');
	close();
};
</script>

<template>
	<BaseModal ref="modalConfirmRef" :title="title" :message="message">
		<template #actions>
			<menu class="modal-action px-8 py-6 m-0 bg-gray-100">
				<button
					class="btn btn-tertiary"
					title="Close the modal and cancel the action"
					@click.prevent="onCancelClicked"
				>
					Cancel
				</button>
				<button
					class="btn btn-primary"
					title="Confirm the action"
					@click.prevent="onConfirmClicked"
				>
					Confirm
				</button>
			</menu>
		</template>
	</BaseModal>
</template>
