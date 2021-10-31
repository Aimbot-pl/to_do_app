<template>
	<form @submit.prevent="login({ username, password })">
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
				ref="ref_password"
			/>
			<button
				class="password-button bi bi-eye-slash"
				ref="passwordButton"
				@click.prevent="
					togglePassword($refs.ref_password, $refs.passwordButton)
				"
			></button>
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
import { computed, ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from "vuex";
import togglePassword from "../../helpers/TogglePassword";
export default {
	name: "Login component",
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		
		const username = ref(null);
		const password = ref(null);

		const loginErrors = computed(() => store.getters.loginErrors);
		const userErrors = computed(() => store.getters.userErrors);
		const login = (credentials) => {
			store.dispatch('login', credentials)
				.then((user) => {
					if (route.query.redirect) {
							router.replace(route.query.redirect);
					} else {
						router.replace({
							name: "profile",
							params: { user: user.nick }
						});
					}
				})
				.catch((err) => {
					alert(err.data.message);
				});
		}

		const cleanErrors = () => store.dispatch('doCleanLoginErrors');
		

		if (route.from) {
			cleanErrors();
		}

		return {
			username,
			password,
			loginErrors,
			userErrors,
			...togglePassword,
			login, 
			cleanErrors,
			
		}
	}
};
</script>