<template>
    <nav
        v-if="user"
		id="navigation"
        class="
            navbar navbar-dark
            bg-dark
            navbar-expand-md navbar-light
            bg-light
            border-bottom border-2
            rounded-2
            mb-3
        "
    >
        <div class="container-fluid px-2">
            <router-link class="navbar-brand" :to="{ name: 'home' }"
                >Home</router-link
            >
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                class="collapse navbar-collapse ms-end justify-content-end"
                id="navbarNav"
            >
                <ul class="navbar-nav">
                    <li v-if="user" class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-person-circle"></i>
                            {{ user.nick }}
                        </a>
                        <ul
                            class="dropdown-menu dropdown-menu-md-end"
                            aria-labelledby="navbarDropdown"
                        >
                            <li>
                                <router-link
                                    class="dropdown-item"
                                    :to="{
                                        name: 'preferences',
                                        params: { user: user.nick },
                                    }"
                                    >Preferences</router-link
                                >
                            </li>
                            <li>
                                <a
                                    @click="logout"
                                    class="dropdown-item"
                                    href="#"
                                    >Logout</a
                                >
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div
        v-if="message && message.message"
        class="alert"
        :class="`alert-${message.class}`"
    >
        {{ message.message }}
    </div>
    <div class="container">
        <router-view></router-view>
    </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { watch } from "@vue/runtime-core";
export default {
    name: "App",
    setup() {
        const store = useStore();
        const router = useRouter();

        const logout = () => {
			store.dispatch("logout")
			.then(() => {
				commit('setAlertMessage', {class: 'warning', message: res.data.message})
			})
		};
        const fetchUser = () => store.dispatch("fetchUser");
        const fetchAuth = () => store.dispatch("fetchAuth");

        const alertMessage = computed(() => store.getters.alertMessage);
        const executeAction = computed(() => store.state.account.executeAction);
        const message = ref({});

        watch([alertMessage, executeAction], (curValue, oldValue) => {
			if (curValue[1] == 'clearAlertMessage') {
				message.value = {};
				store.commit('clearAction');
			} else if (curValue[0]) {
				message.value.message = curValue[0].message;
				message.value.class = curValue[0].class; 
				store.commit("clearAlertMessage");
			}
        });

        fetchUser().then(() => {
            fetchAuth().then((res) => {
                router.replace({
                    name: "user",
                    params: {
                        user: res.data.user.nick,
                    },
                });
            });
        });

        return {
            fetchAuth,
            logout,
            user: computed(() => store.state.account.user),
            message,
        };
    },
};
</script>

<style>
.password-button {
    position: absolute;
    left: calc(100% - 30px);
    top: 0.4em;
    padding: 5px;
    z-index: 3;
    border: none;
    background-color: inherit;
}
</style>
