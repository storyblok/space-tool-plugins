<script setup lang="ts">
const config = useAppConfig();
const { completed, appBridgeAuth, oauth } = useAppBridge();

const nuxtApp = useNuxtApp();
nuxtApp.provide('appBridge', {
	completed,
	appBridgeAuth,
	oauth,
});
</script>

<template>
	<slot v-if="!config.appBridge.enabled || completed" />
</template>
