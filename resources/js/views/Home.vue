<template>
	<div v-if="user">
		<Feed/>
	</div>
	<div v-else class="row justify-content-around mt-5">
		<div class="col-11 col-lg-6 mb-4">
			<h1>Laravel application</h1>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
				ad quas delectus eaque, molestias optio placeat possimus nostrum
				magnam fuga modi recusandae. Quisquam, ratione facilis fugit sit
				magni alias similique.
			</p>
		</div>
		<div class="col-11 col-md-8 col-lg-5 border border-2 rounded-3 px-5 py-3">
			<LoginComp />
			<hr />

			<div class="text-center">
				<button
					class="btn btn-success px-5"
					data-bs-toggle="modal"
					data-bs-target="#register"
					@click="toggleModal(true)"
				>
					Register
				</button>
			</div>
		</div>
		<div
			class="modal fade"
			id="register"
			data-bs-backdrop="static" 
			data-bs-keyboard="false"
			tabindex="-1"
			aria-labelledby="registerModalLabel"
			aria-hidden="true"
			ref="registerModal"
		>
			<div class="modal-dialog modal-lg modal-dialog-scrollable">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="registerModalLabel">
							Register
						</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							@click="toggleModal(false)"
						></button>
					</div>
					<div class="modal-body py-3 px-5">
						<Register v-if="showModal" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { useStore } from 'vuex';
	import LoginComp from "../components/account/Login.vue";
	import Register from "../components/account/Register.vue";
	import Feed from "../components/account/Feed.vue";
	import { computed, ref } from '@vue/reactivity';
	import { watch } from '@vue/runtime-core';
	import { useRoute } from 'vue-router';

	export default {
		name: "Home",
		components: {
			LoginComp,
			Register,
			Feed,
		},
		setup() {
			const store = useStore();
			const route = useRoute();
			const showModal = ref(false);
			const registerModal = ref(null);

			const props = route.params.routeAlert ? JSON.parse(route.params.routeAlert) : null;

			if (props) {
				store.commit('setAlertMessage', props);
			}

			const executeAction = computed(() => store.state.account.executeAction);

			watch(executeAction, (action, oldAction) => {
				if (action === 'closeModal') {
					toggleModal(false);
					bootstrap.Modal.getInstance(registerModal.value).hide();
				}
				store.commit('clearAction');
			})

			const toggleModal = (state) => {
				showModal.value = state
			}
			
			return {
				showModal,
				registerModal,
				toggleModal,
				user: computed(() => store.getters.user)
			}
		},
	};
</script>
