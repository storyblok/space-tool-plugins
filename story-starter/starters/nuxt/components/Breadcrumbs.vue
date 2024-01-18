<script setup lang="ts">
defineProps<{
	slugs: string[];
	setSlugs: (slugs: string[]) => void;
}>();
</script>

<template>
	<div class="text-sm text-gray-600 breadcrumbs">
		<ol>
			<li>
				<BreadcrumbItem
					:is-home="true"
					:is-clickable="slugs.length > 0"
					label="Home"
					@click="setSlugs([])"
				/>
			</li>
			<li v-for="(slug, index) in slugs" :key="slug">
				<BreadcrumbItem
					:is-home="false"
					:is-clickable="index < slugs.length - 1"
					:label="slug"
					@click="setSlugs(slugs.slice(0, index + 1))"
				/>
			</li>
		</ol>
	</div>
</template>
