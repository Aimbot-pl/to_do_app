<template>
	<nav class="navbar navbar-expand-md navbar-light bg-light">
		<div class="container-fluid">
			<router-link class="navbar-brand" :to="{ name: 'home' }"
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
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<router-link class="nav-link" :to="{ name: 'tasks' }"
							>Tasks</router-link
						>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" :to="{ name: 'test' }"
							>Test</router-link
						>
					</li>
					<li class="nav-item">
						<router-link
							class="nav-link"
							:to="{ name: 'testSecond' }"
							>Test 2</router-link
						>
					</li>
					<li v-if="userId" class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle"
							href="#"
							id="navbarDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Profile
						</a>
						<ul
							class="dropdown-menu dropdown-menu-right"
							aria-labelledby="navbarDropdown"
						>
							<li>
								<router-link
									class="dropdown-item"
									:to="{name: 'user', params: {id: userId}}"
									>Settings</router-link
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
import { mapActions, mapGetters, mapState } from "vuex";
export default {
	name: "App",
	created() {
		this.fetchAuth()
	},
	computed: {
		...mapGetters({
			accessToken: 'accessToken',
			userId: 'userId'
		}),
	},
	methods: {
		...mapActions([
			'logout',
			'fetchAuth',
		]),
		logFetchAccessToken() {
			this.fetchAuth()
			return this.accessToken
		}
	},
};
</script>