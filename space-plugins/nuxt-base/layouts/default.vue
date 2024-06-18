<script setup lang="ts">
const { status } = useAppBridge();
</script>

<template>
	<slot v-if="status === 'authenticated'" />
	<div v-else-if="status === 'authenticating'"></div>
	<div v-else-if="status === 'error'"></div>
</template>
