<template>
	<nav
		v-if="user"
		class="
			navbar navbar-dark bg-dark navbar-expand-md navbar-light
			bg-light
			border-bottom border-2
			rounded-2 mb-3
		"
	>
		<div class="container-fluid px-2">
			<router-link class="navbar-brand" :to="{ path: '/' }"
				>Home</router-link
			>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div
				class="collapse navbar-collapse ms-end justify-content-end"
				id="navbarNav"
			>
				<ul class="navbar-nav">
					<li v-if="user" class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle"
							href="#"
							id="navbarDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<i class="bi bi-person-circle"></i>
							{{ user.nick }}
						</a>
						<ul
							class="dropdown-menu dropdown-menu-md-end"
							aria-labelledby="navbarDropdown"
						>
							<li>
								<router-link
									class="dropdown-item"
									:to="{
										name: 'user',
										params: { user: user.nick },
									}"
									@click="logUser"
									>Preferences</router-link
								>
							</li>
							<li>
								<a
									@click="logout"
									class="dropdown-item"
									href="#"
									>Logout</a
								>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div class="container">
		<router-view></router-view>
	</div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { useStore } from "vuex";
export default {
	name: "App",
	setup() {
		const store = useStore();

        const logUser = () => console.log('You has been logged');
		const logout = () => store.dispatch('logout');
		const fetchAuth = () => store.dispatch('fetchAuth');
		fetchAuth();

		return {
			fetchAuth,
			logUser,
			logout,
			user: computed(() => store.state.account.user)
		};
	}
};
</script>
