<template>
	<h1 class="text-center my-3">Change password</h1>
	<form @submit.prevent="submitForm(credentials)" class="mx-auto px-4">
		<div class="row">
			<label for="old_password" class="form-label"
				>Enter old password</label
			>
			<input
				type="password"
				name="old_password"
				id="old_password"
				class="form-control"
                v-model="credentials.old_password"
                ref="old_password"
			/>
            <div v-if="errors.old_password">
                <p v-for="error in errors.old_password" :key="error" class="invalid-feedback d-block">
                    {{ error }}
                </p>
            </div>
		</div>

		<div class="row">
			<label for="new_password" class="form-label"
				>Enter new password</label
			>
			<input
				type="password"
				name="new_password"
				id="new_password"
				class="form-control"
                v-model="credentials.new_password"
                ref="new_password"
			/>
            <div v-if="errors.new_password">
                <p v-for="error in errors.new_password" :key="error" class="invalid-feedback d-block">
                    {{ error }}
                </p>
            </div>
		</div>

		<div class="row">
			<label for="new_password_confirmation" class="form-label"
				>Confirm new password</label
			>
			<input
				type="password"
				name="new_password_confirmation"
				id="new_password_confirmation"
				class="form-control"
                v-model="credentials.new_password_confirmation"
                ref="new_password_confirmation"
			/>
            <div v-if="errors.new_password_confirmation">
                <p v-for="error in errors.new_password_confirmation" :key="error" class="invalid-feedback d-block">
                    {{ error }}
                </p>
            </div>

		</div>

        <div class="text-center mt-3">
			<input
				type="submit"
				:class="{ disabled: isDisabled }"
				class="btn btn-success"
				value="Change password"
			/>
		</div>
	</form>
</template>

<script>
import { mapActions } from "vuex";
export default {
	data() {
		return {
			credentials: {
				old_password: null,
				new_password: null,
				new_password_confirmation: null,
			},
			errors: {
                new_password: ['This field is required.', 'Password must contain at least 4 symbols']
            },
			isDisabled: false,
		};
	},
	methods: {
		...mapActions({
			changePassword: "changePassword",
		}),
		submitForm(credentials) {
			this.isDisabled = true;
			this.changePassword(credentials);
		},
	},
};
</script>

<style>
    input[type="text"],[type="password"] {
        margin-bottom: 0.75rem;
    }
</style>