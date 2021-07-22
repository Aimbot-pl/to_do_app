<template>
	<nav>
		<ul class="pagination">
			<li
				v-for="link in links"
				:key="link.url"
				:class="[link.active ? 'active' : '']"
				class="page-item"
			>
				<a @click="$emit('tasks-navigation', link.url)" class="page-link">
					{{ link.label }}
				</a>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
    name: 'TaksPagination',
    props: ['links']
};
</script>

<style>
</style>