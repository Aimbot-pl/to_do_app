<template>
	<h1 class="text-center my-3">Change password</h1>
	<h3 class="invalid-feedback" v-if="errors.message">
		{{ errors.message }}
	</h3>
	<h3>
		{{ message }}
	</h3>
	<form
		@submit.prevent="
			submitForm({
				old_password,
				new_password,
				new_password_confirmation,
			})
		"
		class="mx-auto px-4"
	>
		<div class="row">
			<label for="old_password" class="form-label"
				>Enter old password</label
			>
			<input
				type="password"
				name="old_password"
				id="old_password"
				class="form-control"
				v-model="old_password"
				autofocus
				ref="old_password"
			/>
			<div v-if="errors.old_password">
				<p
					v-for="error in errors.old_password"
					:key="error"
					class="invalid-feedback d-block"
				>
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
				v-model="new_password"
				ref="new_password"
			/>
			<div v-if="errors.new_password">
				<p
					v-for="error in errors.new_password"
					:key="error"
					class="invalid-feedback d-block"
				>
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
				v-model="new_password_confirmation"
				ref="new_password_confirmation"
			/>
			<div v-if="errors.new_password_confirmation">
				<p
					v-for="error in errors.new_password_confirmation"
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
				:class="{ disabled: isDisabled }"
				class="btn btn-success"
				value="Change password"
			/>
		</div>
	</form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	data() {
		return {
			old_password: null,
			new_password: null,
			new_password_confirmation: null,
			// message: null,
			// errors: {},
			// isDisabled: false,
		};
	},
	computed: {
		...mapGetters({
			errorss: 'changePasswordErrors',
			messageText: 'message',
		}),
		isDisabled() {
			return (this.errors.old_password*this.errors.new_password*this.errors.new_password_confirmation) ? true : false
		},
		message() {
			return this.messageText ? this.messageText : ''
		},
		errors() {
			return {...this.errorss}
		}
	},
	methods: {
		...mapActions({
			changePassword: "changePassword",
		}),
		submitForm(credentials) {
			// this.isDisabled = true;
			if (this.checkEverything()) {
				this.changePassword(credentials);
			} else {
				// this.isDisabled = false;
			}
		},
		checkEverything() {
			return this.check(this.$refs.old_password) *
				this.check(this.$refs.new_password) *
				this.check(this.$refs.new_password_confirmation)
		},
		check(input) {
			if (!input.value) {
				input.classList.value = "form-control is-invalid";
				return false;
			}
			input.classList.value = "form-control";
			return true;
		},
	},
};
</script>