<template>
	<thead class="bg-gray-100">
		<tr>
			<th class="flex items-center gap-3">
				<label class="label">
					<input
						class="checkbox checkbox-xs"
						type="checkbox"
						id="story-select-all"
						@change=""
						:checked="false"
					/>
					<label class="sr-only label-text" for="story-select-all"
						>Toggle All Stories</label
					>
				</label>
				<span>Name</span>
			</th>
			<th class="w-28">Content Type</th>
			<th class="w-28">Last Update</th>
			<th class="w-28">Author</th>
		</tr>
	</thead>
</template>

<style scoped>
th {
	@apply font-normal text-sm text-gray-600 text-left p-2;
}
</style>
