<template>
	<h1 class="text-center my-3">Change password</h1>
	<form
		@submit.prevent="
			changePassword(localUserData)
		"
		class="mx-auto px-4"
	>
		<h3 class="text-danger" v-if="formErrorsMessage">{{ formErrorsMessage }}</h3>
		<h3 class="text-success" v-else-if="formResponseMessage"> {{ formResponseMessage }} </h3>
		<div class="row mb-3">
			<label for="old_password" class="form-label"
				>Enter old password</label
			>
			<div class="input-group">
				<input
					type="password"
					name="old_password"
					id="old_password"
					class="form-control"
					v-model="localUserData.old_password"
					autofocus
					ref="old_password"
				/>
				<button 
					class="password-button bi bi-eye-slash" 
					type="button" 
					ref="oldPasswordButton"
					@click.prevent="togglePassword($refs.old_password, $refs.oldPasswordButton)"
				></button>
			</div>
			<div v-if="formErrors && formErrors.old_password">
				<p
					v-for="error in formErrors.old_password"
					:key="error"
					class="invalid-feedback d-block m-0"
				>
					{{ error }}
				</p>
			</div>
		</div>

		<div class="row mb-3">
			<label for="new_password" class="form-label"
				>Enter new password</label
			>
			<div class="input-group">
				<input
					type="password"
					name="new_password"
					id="new_password"
					class="form-control"
					v-model="localUserData.new_password"
					ref="new_password"
				/>
				<button 
					class="password-button bi bi-eye-slash" 
					type="button" 
					ref="new_password_button"
					@click.prevent="togglePassword($refs.new_password, $refs.new_password_button)"
				></button>
			</div>
			<div v-if="formErrors && formErrors.new_password">
				<p
					v-for="error in formErrors.new_password"
					:key="error"
					class="invalid-feedback d-block"
				>
					{{ error }}
				</p>
			</div>
		</div>

		<div class="row mb-3">
			<label for="new_password_confirmation" class="form-label"
				>Confirm new password</label
			>
			<div class="input-group">
				<input
					type="password"
					name="new_password_confirmation"
					id="new_password_confirmation"
					class="form-control"
					v-model="localUserData.new_password_confirmation"
					ref="new_password_confirmation"
				/>

				<button 
					class="password-button bi bi-eye-slash" 
					type="button" 
					ref="new_password_confirmation_button"
					@click.prevent="togglePassword($refs.new_password_confirmation, $refs.new_password_confirmation_button)"
				></button>
		</div>
			<div v-if="formErrors && formErrors.new_password_confirmation">
				<p
					v-for="error in formErrors.new_password_confirmation"
					:key="error"
					class="invalid-feedback d-block"
				>
					{{ error }}
				</p>
			</div>
		</div>

		<div class="text-center mt-3">
			<input
				type="submit"
				class="btn btn-success"
				value="Change password"
			/>
		</div>
	</form>
</template>

<script>
import { ref } from '@vue/reactivity';
import { useStore } from "vuex";
import togglePassword from '../../helpers/TogglePassword';
export default {
	name: 'Change password',
	setup() {
		const store = useStore();

		const errorss = ref({});
		const formErrors = ref({});
		const formErrorsMessage = ref(null);
		const formResponseMessage = ref(null);
		const responsee = ref({});
		const errors = ref({});

		const localUserData = ref({});
		localUserData.value = {
			old_password: '',
			new_password: '',
			new_password_confirmation: ''
		};

		const changePassword = credentials => {
			responsee.value = null;
			errorss.value = null;
			formErrors.value = null;
			formErrorsMessage.value = null;

			store.dispatch('changePassword', credentials)
			.then(res => {
				responsee.value = res.data;
				localUserData.value = {
					old_password: '',
					new_password: '',
					new_password_confirmation: ''
				};
				formResponseMessage.value = res.data.message;
			})
			.catch(err => {
				errorss.value = err;
				formErrors.value = err.data.errors;
				formErrorsMessage.value = err.data.message;
			})
			.finally(() => {});
		}
		return {
			localUserData,
			errorss,
			formErrors,
			formErrorsMessage,
			formResponseMessage,
			responsee,
			errors,
			changePassword,
			...togglePassword
		}
	}
};
</script>

<style>
	.password-button {
		left: calc(100% - 40px);
		z-index: 1000000000000;
	}
</style>