<template>
	<div v-if="user" class="col-lg-10 m-auto">
		<div class="row my-3 p-3">
			<div class="col-2">
				<i class="bi-person-square display-1"></i>
			</div>
			<div class="col">
				<h1>{{ user.first_name }} {{ user.last_name }}</h1>
			</div>
		</div>

		<nav aria-label="breadcrumb" class="navbar navbar-expand mb-3">
			<ol class="border border-2 breadcrumb rounded rounded-3 col-12 p-3">
				<li class="breadcrumb-item">
					<router-link
						
						:to="{
							name: 'profile',
							params: { user: user.nick },
						}"
					>
						Profile
					</router-link>
				</li>

				<li class="breadcrumb-item">
					<router-link :to="{ name: 'preferences' }">
						Preferences
					</router-link>
				</li>
			</ol>
		</nav>
		<router-view> </router-view>
	</div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { useStore } from "vuex";
export default {
	name: "User component",
	setup() {
		const store = useStore();
		const user = computed(() => store.getters.user);
		document.title = user.value.nick;
		
		return {
			user
		}
	}
};
</script>

<style>
li.nav-path::before {
	content: "/";
}

li.nav-path:first-child::before {
	content: "";
}

li.nav-path > a {
	display: inline flow-root list-item;
}
</style>