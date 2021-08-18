<template>
	<form @submit.prevent="createAccount">
		<h2 class="text-danger d-block" v-if="errors">{{ errors.message }}</h2>
		<h2 v-else-if="message">{{ message }}</h2>
		<div class="row g-3">
			<div class="col">
				<label class="form-label" for="first-name">First name</label>
				<input
					type="text"
					id="first-name"
					name="first-name"
					v-model="first_name"
					class="form-control"
					aria-label="First name"
					ref="nameInput"
				/>
				<div
					class="invalid-feedback d-block"
					v-if="errors && errors.first_name"
				>
					<p v-for="error in errors.first_name" :key="error">
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
					v-model="last_name"
					class="form-control"
					aria-label="Last name"
				/>
				<password_confirmation
					class="invalid-feedback d-block"
					v-if="errors && errors.last_name"
				>
					<p v-for="error in errors.last_name" :key="error">
						{{ error }}
					</p>
				</password_confirmation>
			</div>
		</div>
		<div class="col-12">
			<label for="nick" class="form-label mt-3">Nick</label>
			<input
				type="text"
				name="nick"
				v-model="nick"
				id="nick"
				class="form-control"
			/>
			<div class="invalid-feedback d-block" v-if="errors && errors.nick">
				<p v-for="error in errors.nick" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="col-12">
			<label for="email" class="form-label mt-3">Email</label>
			<input
				type="email"
				name="email"
				v-model="email"
				id="email"
				class="form-control"
			/>
			<div class="invalid-feedback d-block" v-if="errors && errors.email">
				<p v-for="error in errors.email" :key="error">
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
					v-model="password"
					id="password"
					class="form-control"
					ref="password"
				/>
				<button
					type="button"
					class="btn btn-outline-success"
					ref="passwordButton"
					@click.prevent="togglePassword($refs.password, $refs.passwordButton)"
				>
					Show
				</button>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="errors && errors.password"
			>
				<p v-for="error in errors.password" :key="error">
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
					v-model="passwordConfirmation"
					id="password_confirmation"
					class="form-control"
					ref="passwordConfirmation"
				/>
				<button
					type="button"
					class="btn btn-outline-success"
					ref="passwordConfirmationButton"
					@click.prevent="
						togglePassword(
							$refs.passwordConfirmation,
							$refs.passwordConfirmationButton
						)
					"
				>
					Show
				</button>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="errors && errors.password_confirmation"
			>
				<p v-for="error in errors.password_confirmation" :key="error">
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
						v-model="gender"
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
						v-model="gender"
						id="female"
						class="mt-1"
						value="female"
					/>
				</p>
			</div>
			<div
				class="invalid-feedback d-block"
				v-if="errors && errors.gender"
			>
				<p v-for="error in errors.gender" :key="error">
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
import togglePassword from '../../helpers/TogglePassword'
export default {
	data() {
		return {
			first_name: "",
			nick: "",
			last_name: "",
			email: "",
			password: "",
			password_confirmation: "",
			gender: "",
			isDisabled: false,
			errors: {},
			message: "",
		};
	},
	mounted() {
		setTimeout(() => {
			this.$refs.nameInput.focus();
		}, 500);
	},
	methods: {
		...togglePassword,
		createAccount() {
			this.isDisabled = true;
			this.errors = null;
			axios.get("/sanctum/csrf-cookie").then((response) => {
				axios
					.post("/api/register", {
						nick: this.nick,
						first_name: this.first_name,
						last_name: this.last_name,
						email: this.email,
						password: this.password,
						password_confirmation: this.password_confirmation,
						gender: this.gender,
					})
					.then((res) => {
						this.message = res.data.message;
					})
					.catch((err) => {
						this.errors = err.response.data.errors;
						this.errors.message = err.response.data.message;
					})
					.finally(() => {
						this.isDisabled = false;
					});
			});
		},
	},
};
</script>
