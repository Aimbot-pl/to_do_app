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

		<nav class="navbar navbar-expand mb-3">
			<ul class="navbar-nav border border-2 rounded-2 col-12 px-3 py-1">
				<li class="nav-item nav-path">
					<router-link
						class="nav-link"
						:to="{
							name: 'profile',
							params: { user: user.nick },
						}"
					>
						Profile
					</router-link>
				</li>

				<li class="nav-item nav-path">
					<router-link class="nav-link" :to="{ name: 'preferences' }">
						Preferences
					</router-link>
				</li>
			</ul>
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