<script setup lang="ts">
const config = useAppConfig();
const { status } = useAppBridge();
</script>

<template>
	<slot v-if="!config.appBridge.enabled || status === 'authenticated'" />
	<div v-else-if="status === 'authenticating'"></div>
	<div v-else-if="status === 'error'"></div>
</template>
