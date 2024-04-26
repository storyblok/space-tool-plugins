<script setup lang="ts">
const alert = useAlert();
alert.success('Hello, World!');
</script>

<template>
	<BaseAlert
		v-if="alert.state.show"
		:message="alert.state.message"
		:type="alert.state.type"
	/>
</template>
