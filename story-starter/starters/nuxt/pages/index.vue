<template>
	<div class="mx-20 my-11">
		<Header title="Story Starter">
			<template #icon>
				<LucideTornado class="text-primary" />
			</template>
			<template #description>
				Dive into the largest keyword research database on the market, get
				additional keywords to enhance your website contextual background, and
				improve your SEO.
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
