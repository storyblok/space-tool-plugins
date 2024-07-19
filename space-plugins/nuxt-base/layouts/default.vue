<script setup lang="ts">
const config = useAppConfig();
const { completed, appBridgeAuth, oauth } = useAppBridge();
</script>

<template>
	<div>
		<pre>{{ { appBridgeAuth, oauth } }}</pre>
		<slot v-if="!config.appBridge.enabled || completed" />
	</div>
</template>
