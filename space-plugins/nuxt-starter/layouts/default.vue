<script setup lang="ts">
const config = useAppConfig();
const appBridge = useAppBridge();
const nuxtApp = useNuxtApp();
nuxtApp.provide('appBridge', appBridge);
</script>

<template>
	<slot v-if="!config.appBridge.enabled || appBridge.completed.value" />
</template>
