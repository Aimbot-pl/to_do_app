<template>
	<div v-if="user">
		<Feed/>
	</div>
	<div v-else class="row justify-content-around mt-5">
		<div class="col-12 col-md-6 my-auto">
			<h1>Laravel application</h1>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
				ad quas delectus eaque, molestias optio placeat possimus nostrum
				magnam fuga modi recusandae. Quisquam, ratione facilis fugit sit
				magni alias similique.
			</p>
		</div>
		<div class="col-12 col-md-6 col-lg-4 border border-2 rounded-3 px-5 py-3">
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
		>
			<div class="modal-dialog modal-dialog-scrollable">
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
					<div class="modal-body">
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

	export default {
		name: "Home",
		components: {
			LoginComp,
			Register,
			Feed,
		},
		setup() {
			const store = useStore();
			const showModal = ref(false);

			const toggleModal = (state) => {
				showModal.value = state
			}
			
			return {
				showModal,
				toggleModal,
				user: computed(() => store.getters.user)
			}
		},
	};
</script>
