<template>
	<h1 class="text-center my-3">Your data</h1>
	<form class="mx-auto px-3" @submit.prevent="saveChanges(localUserData)">
		<h2 class="text-danger d-block" v-if="localErrors">
			{{ localErrors.message }}
		</h2>
		<h2 v-else-if="message">{{ message }}</h2>
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
					v-if="localErrors && localErrors.first_name"
				>
					<p v-for="error in localErrors.first_name" :key="error">
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
					v-if="localErrors && localErrors.last_name"
				>
					<p v-for="error in localErrors.last_name" :key="error">
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
			<div
				class="invalid-feedback d-block"
				v-if="localErrors && localErrors.nick"
			>
				<p v-for="error in localErrors.nick" :key="error">
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
			<div
				class="invalid-feedback d-block"
				v-if="localErrors && localErrors.email"
			>
				<p v-for="error in localErrors.email" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="row d-flex justify-content-around">
			<p class="form-label mt-3">Gender</p>
			<div class="row gx-3">
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
				<div style="width: 1rem"></div>
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
				v-if="localErrors && localErrors.gender"
			>
				<p v-for="error in localErrors.gender" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="text-center mt-3">
			<input type="submit" class="btn btn-success" value="Save changes" />
		</div>
	</form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	name: "Settings",
	data() {
		return {
			localUserData: {
				first_name: "",
				nick: "",
				last_name: "",
				email: "",
				gender: "",
			},
			message: null,
			showModal: false,
			localErrors: {},
		};
	},
	mounted() {
		document.title = `Preferences`;
		if (this.user) {
			this.localUserData = { ...this.user };
		} else if (this.errors) {
			this.localErrors = this.errors;
		}
		if (!this.user) {
			this.$router.replace({
				name: "user",
				query: { redirect: $route.fullPath },
			});
		}
	},
	computed: {
		...mapGetters({
			userId: "userId",
			errors: "userErrors",
			user: "user",
		}),
	},
	methods: {
		...mapActions(["fetchUserData", "saveChanges"]),
		closeModal() {
			this.showModal = false;
			this.message = null;
		},
	},
};
</script>