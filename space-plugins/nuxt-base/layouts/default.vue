<script setup lang="ts">
const config = useAppConfig();
const { completed } = useAppBridge();
</script>

<template>
	<slot v-if="!config.appBridge.enabled || completed" />
</template>
