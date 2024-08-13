<script setup lang="ts">
const { isShowingLoader } = useLoader();
</script>

<template>
	<div
		v-if="isShowingLoader"
		class="absolute inset-0 flex items-center justify-center"
	>
		<div class="absolute inset-0 bg-black opacity-60" />
		<LucideLoader2 class="text-primary animate-spin" />
	</div>
</template>
