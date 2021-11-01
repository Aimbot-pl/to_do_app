<template>
	<form @submit.prevent="createAccount">
		<h2 class="d-block text-success" v-if="response.message && response.status === 201">{{ response.message }}</h2>
		<h2 class="text-danger d-block" v-else-if="response.message">{{ response.message }}</h2>
		<div class="row g-3">
			<div class="col">
				<label class="form-label" for="first-name">First name</label>
				<input
					type="text"
					id="first-name"
					name="first-name"
					v-model="localUserData.first_name"
					class="form-control"
					aria-label="First name"
					ref="nameInput"
				/>
				<div
					class="invalid-feedback d-block"
					v-if="response.errors && response.errors.first_name"
				>
					<p v-for="error in response.errors.first_name" :key="error">
						{{ error }}
					</p>
				</div>
			</div>
			<div class="col">
				<label for="last-name" class="form-label">Last name</label>
				<input
					type="text"
					id="last-name"
					name="last-name"
					v-model="localUserData.last_name"
					class="form-control"
					aria-label="Last name"
				/>
				<div
					class="invalid-feedback d-block"
					v-if="response.errors && response.errors.last_name"
				>
					<p v-for="error in response.errors.last_name" :key="error">
						{{ error }}
					</p>
				</div>
			</div>
		</div>
		<div class="col-12">
			<label for="nick" class="form-label mt-3">Nick</label>
			<input
				type="text"
				name="nick"
				v-model="localUserData.nick"
				id="nick"
				class="form-control"
			/>
			<div class="invalid-feedback d-block" v-if="response.errors && response.errors.nick">
				<p v-for="error in response.errors.nick" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="col-12">
			<label for="email" class="form-label mt-3">Email</label>
			<input
				type="email"
				name="email"
				v-model="localUserData.email"
				id="email"
				class="form-control"
			/>
			<div class="invalid-feedback d-block" v-if="response.errors && response.errors.email">
				<p v-for="error in response.errors.email" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="col-12">
			<label for="password" class="form-label mt-3">Password</label>
			<div class="input-group">
				<input
					type="password"
					name="password"
					v-model="localUserData.password"
					id="password"
					class="form-control"
					ref="password"
				/>
				<button
					type="button"
					class="password-button bi bi-eye-slash"
					ref="passwordButton"
					@click.prevent="togglePassword($refs.password, $refs.passwordButton)"
				></button>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="response.errors && response.errors.password"
			>
				<p v-for="error in response.errors.password" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="col-12">
			<label for="password_confirmation" class="form-label mt-3"
				>Confirm password</label
			>
			<div class="input-group">
				<input
					type="password"
					name="password_confirmation"
					v-model="localUserData.password_confirmation"
					id="password_confirmation"
					class="form-control"
					ref="passwordConfirmation"
				/>
				<button
					type="button"
					class="password-button bi bi-eye-slash"
					ref="passwordConfirmationButton"
					@click.prevent="
						togglePassword(
							$refs.passwordConfirmation,
							$refs.passwordConfirmationButton
						)
					"
				></button>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="response.errors && response.errors.password_confirmation"
			>
				<p v-for="error in response.errors.password_confirmation" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="row d-flex justify-content-around">
			<p class="form-label mt-3">Gender</p>
			<div class="row">
				<p class="col border border-2 rounded-3 d-flex p-1">
					<label for="male" class="flex-grow-1">Male</label>
					<input
						type="radio"
						name="gender"
						v-model="localUserData.gender"
						id="male"
						class="mt-1"
						value="male"
					/>
				</p>
				<div style="width: 1rem;"></div>
				<p class="col border border-2 rounded-3 d-flex p-1">
					<label for="female" class="flex-grow-1">Female</label>
					<input
						type="radio"
						name="gender"
						v-model="localUserData.gender"
						id="female"
						class="mt-1"
						value="female"
					/>
				</p>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="response.errors && response.errors.gender"
			>
				<p v-for="error in response.errors.gender" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="text-center mt-3">
			<input
				type="submit"
				:class="{ disabled: isDisabled }"
				class="btn btn-success"
				value="Create account"
			/>
		</div>
	</form>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import togglePassword from '../../helpers/TogglePassword'
import { onMounted } from '@vue/runtime-core';
export default {
	name: "Register component",
	setup() {
		const store = useStore();

		const nameInput = ref(null);
		onMounted(() => {
			nameInput.value.focus();
		});

		const signUp = (credentials) => store.dispatch('signUp', credentials);
		const createAccount = () => {
			isDisabled.value = true;
			let letRegister = true;
			clearErrors();
			requiredFields.forEach(item => {
				if (localUserData.value[item] == '') {
					response.value.errors[item].push('Fill this field.');
					letRegister = false;
				}
			})
			if (letRegister) {
				store.dispatch('signUp', localUserData.value)
					.then((res) => 	response.value = {
										message: res.data.message, 
										status: res.status
									}
					)
					.catch(err => {
						response.value = {
							errors: err.data.errors,
							message: err.data.message,
							status: err.status
						};
					});
			} else {
				response.value.message = 'Fill every field';
			}

			isDisabled.value = false;
		}

		const response = ref({});
		const clearErrors = () => {
			response.value = {
				errors: {
					first_name: [],
					last_name: [],
					nick: [],
					email: [],
					password: [],
					password_confirmation: [],
					gender: []
				},
				message: ''
			};
		}
		clearErrors();
		

		const isDisabled = ref(false);
		const requiredFields = [
			'first_name', 
			'nick',
			'last_name',
			'email',
			'password',
			'password_confirmation',
			'gender'
		];

		const localUserData = ref({});
		localUserData.value = {
			first_name: "",
			nick: "",
			last_name: "",
			email: "",
			password: "",
			password_confirmation: "",
			gender: "",
		};

		return {
			signUp,
			nameInput,
			createAccount,
			isDisabled,
			response,
			localUserData,
			...togglePassword
		}
	},
};
</script>
