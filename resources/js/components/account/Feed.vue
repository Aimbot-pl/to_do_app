<template>
	<div v-if="user">
		<h1>Hello {{ user.nick }}</h1>
		<router-link :to="{ 
						name: 'profile', 
						params: { 
							user: user.nick 
						}
					}">
			Go to your profile
		</router-link>
	</div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { mapActions, mapGetters, useStore} from "vuex";
import { onMounted } from '@vue/runtime-core';
export default {
	name: "Feed",
	setup() {
		const store = useStore();
		const user = computed(() => store.getters.user);
		return {
			user
		}
	}
};
</script>