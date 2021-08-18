<template>
	<form @submit.prevent="signIn({ username, password })">
		<h2 v-if="error" class="text-danger">{{ error }}</h2>
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
import { mapActions, mapGetters, mapState } from "vuex";
import togglePassword from "../../helpers/TogglePassword";
export default {
	name: "Login",
	data() {
		return {
			username: "",
			password: "",
		};
	},
	computed: {
		...mapState(['userId']),
		...mapGetters({
			error: 'loginErrors'
		}),
	},
	methods: {
		...togglePassword,
		...mapActions(["login"]),
		signIn(credentials) {
			this.login(credentials).then(() => {
				if (this.$route.query.redirect) {
					this.$router.replace(this.$route.query.redirect);
				} else {
					this.$router.replace("/");
				}
			})
		},
	},
};
</script>