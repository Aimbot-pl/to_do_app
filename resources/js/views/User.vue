<template>
	User
    <ul class="navbar-nav">
        <li class="navbar-item">
            <router-link :to="{name: 'Settings'}">
                Settings
            </router-link>
        </li>
    </ul>
    <router-view></router-view>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
	data() {
		return {

			user: null,
		};
	},

	created() {
		this.fetchDatas()
	},
    mounted() {
        console.log(this.$store.state.account)
    },
	computed: {
		...mapGetters({
			errors: "userErrors",
			userData: "userData",
		}),
	},
	methods: {
		...mapActions({
			fetchDatas: "fetchUserData",
		}),
	},
};
</script>