<script setup lang="ts">
defineProps<{
	slugs: string[];
	setSlugs: (slugs: string[]) => void;
}>();
</script>

<template>
	<div class="text-sm text-gray-600 breadcrumbs">
		<ul>
			<li>
				<BreadcrumbItem
					:isHome="true"
					:isClickable="slugs.length > 0"
					label="Home"
					@click="setSlugs([])"
				/>
			</li>
			<li v-for="(slug, index) in slugs">
				<BreadcrumbItem
					:isHome="false"
					:isClickable="index < slugs.length - 1"
					:label="slug"
					@click="setSlugs(slugs.slice(0, index + 1))"
				/>
			</li>
		</ul>
	</div>
</template>
