<template>
	<form @submit.prevent="signIn({ username, password })">
		<h2 v-if="loginErrors" class="text-danger">{{ loginErrors }}</h2>
		<h2 v-if="userErrors" class="text-danger">{{ userErrors.message }}</h2>
		<label for="username" class="form-label mt-3">Email</label>
		<input
			type="text"
			name="username"
			class="form-control"
			id="username"
			v-model="username"
		/>

		<label for="password" class="form-label mt-3">Password</label>
		<div class="input-group">
			<input
				type="password"
				name="password"
				class="form-control"
				id="password"
				v-model="password"
				ref="password"
			/>
			<button
				class="btn btn-outline-success"
				ref="passwordButton"
				@click.prevent="
					togglePassword($refs.password, $refs.passwordButton)
				"
			>
				Show
			</button>
		</div>

		<input
			type="submit"
			value="Log in"
			class="btn btn-info form-control mt-3"
		/>
	</form>
	<router-link :to="{ name: 'forgotPassword' }" class="mt-3"
		>Forgot the password?</router-link
	>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import togglePassword from "../../helpers/TogglePassword";
export default {
	name: "LoginComp",
	data() {
		return {
			username: "",
			password: "",
		};
	},
	created() {
		if (!this.$route.from) {
			this.cleanErrors();
		}
	},
	computed: {
		...mapGetters(["loginErrors", "userErrors"]),
	},
	methods: {
		...togglePassword,
		...mapActions({
			login: "login",
			cleanErrors: "doCleanLoginErrors",
		}),
		signIn(credentials) {
			setTimeout(() => {
				if (this.$route.query.redirect) {
					this.$router.replace(this.$route.query.redirect);
				} else {
					this.$router.replace({
						name: "user",
						params: { user: this.$store.state.account.user.nick },
					});
				}
			}, 5000);
			this.login(credentials);
		},
	},
};
</script>