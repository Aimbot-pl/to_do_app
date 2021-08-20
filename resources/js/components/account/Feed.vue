<template>
	<div v-if="user">
		<h1>Hello {{ user.nick }}</h1>
		<router-link :to="{ name: 'user', params: { user: user.nick }}">Go to your profile</router-link>
	</div>
</template>

<script>
import { mapActions, mapGetters} from "vuex";
export default {
	name: "Feed",
	data() {
		return {
			user: null
		}
	},
	created() {
		this.fetchDatas()
	},
	mounted() {
		this.user = this.userData
	},
	computed: {
		...mapGetters({
			userData: 'user'
		}),
	},
	methods: {
		...mapActions({
			fetchDatas: 'fetchUserData'
		})
	}
};
</script>