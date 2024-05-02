<script setup lang="ts">
defineProps<{
	title?: string;
	message?: string;
}>();

const modalRef = ref<HTMLDialogElement | null>(null);

const show = () => modalRef.value?.showModal();
const close = () => modalRef.value?.close();

defineExpose({
	show,
	close,
});
</script>

<template>
	<dialog ref="modalRef" class="modal">
		<form method="dialog" class="modal-box p-0 rounded-lg">
			<section class="flex flex-col gap-4 p-9 items-center">
				<slot name="header">
					<h2 v-if="title" class="font-bold text-xl">
						{{ title }}
					</h2>
				</slot>
				<slot name="content">
					<p v-if="message" class="py-4 text-ink-50 font-normal">
						{{ message }}
					</p>
				</slot>
			</section>
			<slot name="actions" />
		</form>
	</dialog>
</template>
