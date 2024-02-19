<script setup lang="ts">
//TODO: typing
const { data, isLoading, setSettings, refresh, error } = await useSettings();
const name = ref('');

if (!error.value) {
	//load settings in initial load
	name.value = data.value.name;
}

const onSave = async (name: string) => {
	await setSettings({
		name,
	});
};
</script>

<template>
	<span>Loading {{ isLoading }}</span>
	<span>Error {{ error }}</span>
	<button @click="refresh()">refresh</button>
	<span>Current Settings: {{ JSON.stringify(data) }}}</span>
	<div>
		<label for="name" class="label">Name: </label>
		<input class="input" type="text" name="name" v-model="name" />
		<button class="btn" @click="onSave(name)" type="submit">Save</button>
	</div>

	<NuxtLink class="link" to="/">Go back</NuxtLink>
</template>
