<template>
	<h1 class="text-center my-3">Your data</h1>
	<form class="mx-auto px-3" @submit.prevent="saveChanges(localUserData)">
		<h3 class="text-danger d-block" v-if="errorss">
			{{ errorss.message }}
		</h3>
		<h3 class="text-success d-block" v-else-if="responsee && responsee.message">{{ responsee.message }}</h3>
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
					v-model="localUserData.last_name"
					class="form-control"
					aria-label="Last name"
				/>
				<div
					class="invalid-feedback d-block"
					v-if="errors && errors.last_name"
				>
					<p v-for="error in errors.last_name" :key="error">
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
				v-if="errors && errors.nick"
			>
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
				v-model="localUserData.email"
				id="email"
				class="form-control"
			/>
			<div
				class="invalid-feedback d-block"
				v-if="errors && errors.email"
			>
				<p v-for="error in errors.email" :key="error">
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
				v-if="errors && errors.gender"
			>
				<p v-for="error in errors.gender" :key="error">
					{{ error }}
				</p>
			</div>
		</div>
		<div class="text-center mt-3">
			<button id="submit-button" type="submit" class="btn btn-success">
				<div id="spinner-button" class=""></div>
				<span id="submit-text">Save changes</span>	
			</button>
		</div>
	</form>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { useStore } from "vuex";
import { onMounted } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
export default {
	name: "Settings",
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();

		const localUserData = ref({});
		localUserData.value = {
			first_name: "",
			nick: "",
			last_name: "",
			email: "",
			gender: ""
		};
		
		const showModal = ref(false);
		const response = computed(() => store.getters.responseData);
		const errors = computed(() => store.getters.errorsData);

		const errorss = ref({});
		const responsee = ref({});


		const closeModal = () => {
			showModal.value = false;
			message.value = '';
		}

		const user = computed(() => store.getters.user);

		const saveChanges = (newUserData) => {
			let letGo = false;
			responsee.value = null;
			errorss.value = null;
			

			if (JSON.stringify({...newUserData, id: user.value.id}) === JSON.stringify(user.value)) {
				letGo = false;
				errorss.value = {
					data: {
						message: 'Your data are the same.'
					}
				};
			} else {
				letGo = true;
			}

			if (letGo) {
				document.querySelector('#spinner-button').classList.add('spinner-border', 'spinner-border-sm');
				document.querySelector('#submit-button').classList.add('disabled');
				document.querySelector('#submit-text').textContent = 'Loading';
				let i = 0;
				setInterval(() => {
					if (i >= 3 || errorss.value || responsee.value) {
						clearInterval();
					} else {
						i++;
						document.querySelector('#submit-text').textContent += '.';
					}
				}, 400);

				store.dispatch('saveChanges', newUserData)
				.then((res) => {
					responsee.value = res.data;
					errorss.value = null;
					localUserData.value = {
						first_name: res.data.user.first_name,
						nick: res.data.user.nick,
						last_name: res.data.user.last_name,
						email: res.data.user.email,
						gender: res.data.user.gender
					}
				})
				.catch((err) => {
					errorss.value = {
						message: err.message,
					};
					responsee.value = null;
				})
				.finally(() => {
					clearInterval();
					document.querySelector('#spinner-button').classList.remove('spinner-border', 'spinner-border-sm');
					document.querySelector('#submit-button').classList.remove('disabled');
					document.querySelector('#submit-text').textContent = 'Save changes';
				});
			}
			
		};

		onMounted(() => {	
			document.title = `Preferences`;
			if (typeof user.value == 'object') {
				localUserData.value = { ...user.value };
			} 
			if (typeof user.value != 'object') {
				router.replace({
					name: "user",
					query: { redirect: route.fullPath },
				});
			}
		});


		return {
			localUserData,
			showModal,
			responsee,
			errorss,
			errors: null,
			response: null,
			closeModal,
			user,
			saveChanges
		}

	}
};
</script>