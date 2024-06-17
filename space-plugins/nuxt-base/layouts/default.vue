<script setup lang="ts">
const { status } = useAppBridge();
</script>

<template>
	<slot v-if="status === 'authenticated'" />
</template>
