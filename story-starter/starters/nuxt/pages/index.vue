<template>
	<div class="mx-20 my-11">
		<Header title="Story Starter">
			<template #icon>
				<LucideTornado class="text-primary" />
			</template>
			<template #description>
				Story Starter is a boilerplate project that allows you to quickly
				implement a space plugin. This plugin displays a list of stories and
				enables users to perform actions on the selected stories. Open
				<code class="text-teal-100">stories.config.ts</code> file to configure
				this project.
			</template>
			<!-- <template #right-action-bar>
					<button class="btn btn-outline">
						<span class="text-base">Settings</span><LucideSettings :size="16" />
					</button>
				</template> -->
		</Header>

		<div class="mt-10">
			<StoryList />
		</div>
	</div>
</template>
