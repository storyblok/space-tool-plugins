<template>
	<div class="mx-20 my-11">
		<Header title="Story Starter">
			<template #icon>
				<LucideTornado class="text-primary" />
			</template>
			<template #description> This is a `space-plugin-nuxt-starter`. </template>
			<!--			<template #right-action-bar>-->
			<!--			-->
			<!--			</template>-->
		</Header>
		<div class="mt-10">
			<slot />
		</div>
	</div>
</template>
