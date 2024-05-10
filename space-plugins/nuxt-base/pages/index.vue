<script setup lang="ts">
const data = await useFetch('/api/test');
</script>

<template>
	<div>
		<div class="container">
			This is `@storyblok/space-plugin-nuxt-base`.

			<pre>data: {{ data }}</pre>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	widows: 100%;
	height: 100vh;
}
</style>
