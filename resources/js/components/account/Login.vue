<template>
	<form @submit.prevent="login">
		<label for="username" class="form-label mt-3">Username</label>
		<input
			type="text"
			name="username"
			class="form-control"
			id="username"
			v-model="username"
		/>

		<label for="password" class="form-label mt-3">Password</label>
		<input
			type="password"
			name="password"
			class="form-control"
			id="password"
			v-model="password"
		/>

		<span v-if="errors" class="invalid-feedback d-block mt-3">
			{{ errors }}
		</span>

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
export default {
	name: "Login",
	data() {
		return {
			username: "",
			password: "",
			errors: "",
		};
	},
	methods: {
		login() {
			this.errors = "";
			this.errors = "Wrong username or password. Please try again";
		},
	},
};
</script>