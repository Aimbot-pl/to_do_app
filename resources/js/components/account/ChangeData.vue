<template>
    <h1 class="text-center my-3">Your data</h1>
    <form class="mx-auto px-3" @submit.prevent="saveChanges(localUserData)">
        <h4 class="text-danger d-block" v-if="formErrorsMessage">
            {{ formErrorsMessage }}
        </h4>
        <h4 class="text-success d-block" v-else-if="formResponseMessage">
            {{ formResponseMessage }}
        </h4>
        <div class="row g-3">
            <div class="col">
                <label class="form-label" for="first-name">First name</label>
                <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    v-model="localUserData.first_name"
                    class="form-control"
                    :class="[
                        formErrors && formErrors.first_name ? 'is-invalid' : '',
                        formErrors &&
                        Object.keys(formErrors).length &&
                        !formErrors.first_name
                            ? 'is-valid'
                            : '',
                    ]"
                    aria-label="First name"
                    ref="nameInput"
                />
                <div
                    class="invalid-feedback d-block"
                    v-if="formErrors && formErrors.first_name"
                >
                    <p v-for="error in formErrors.first_name" :key="error">
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
                    :class="[
                        formErrors && formErrors.last_name ? 'is-invalid' : '',
                        formErrors &&
                        Object.keys(formErrors).length &&
                        !formErrors.last_name
                            ? 'is-valid'
                            : '',
                    ]"
                    aria-label="Last name"
                />
                <div
                    class="invalid-feedback d-block"
                    v-if="formErrors && formErrors.last_name"
                >
                    <p v-for="error in formErrors.last_name" :key="error">
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
                :class="[
                    formErrors && formErrors.nick ? 'is-invalid' : '',
                    formErrors &&
                    Object.keys(formErrors).length &&
                    !formErrors.nick
                        ? 'is-valid'
                        : '',
                ]"
            />
            <div
                class="invalid-feedback d-block"
                v-if="formErrors && formErrors.nick"
            >
                <p v-for="error in formErrors.nick" :key="error">
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
                :class="[
                    formErrors && formErrors.email ? 'is-invalid' : '',
                    formErrors &&
                    Object.keys(formErrors).length &&
                    !formErrors.email
                        ? 'is-valid'
                        : '',
                ]"
            />
            <div
                class="invalid-feedback d-block"
                v-if="formErrors && formErrors.email"
            >
                <p v-for="error in formErrors.email" :key="error">
                    {{ error }}
                </p>
            </div>
        </div>
        <div class="row d-flex justify-content-around">
            <p class="form-label mt-3">Gender</p>
            <div class="row gx-3">
                <p
                    class="col border border-2 rounded-3 d-flex p-1"
                    :class="[
                        formErrors &&
                        formErrors.gender &&
                        formErrors.gender === localUserData.gender
                            ? 'is-invalid'
                            : '',
                        formErrors &&
                        Object.keys(formErrors).length &&
                        !formErrors.gender &&
                        checkGender('#male')
                            ? 'is-valid'
                            : '',
                    ]"
                >
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
                <p
                    class="col border border-2 rounded-3 d-flex p-1"
                    :class="[
                        formErrors &&
                        formErrors.gender &&
                        formErrors.gender === localUserData.gender
                            ? 'is-invalid'
                            : '',
                        formErrors &&
                        Object.keys(formErrors).length &&
                        !formErrors.gender &&
                        checkGender('#female')
                            ? 'is-valid'
                            : '',
                    ]"
                >
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
                v-if="formErrors && formErrors.gender"
            >
                <p v-for="error in formErrors.gender" :key="error">
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
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
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
            gender: "",
        };

        const showModal = ref(false);
        const formErrors = ref({});
        const formErrorsMessage = ref(null);
		const formResponse = ref({});
        const formResponseMessage = ref(null);

		const checkGender = query => {
			return document.querySelector(query).value === localUserData.value.gender
		}

        const closeModal = () => {
            showModal.value = false;
            message.value = "";
        };

        const user = computed(() => store.getters.user);

        const saveChanges = (newUserData) => {
            let letGo = false;
			formResponse.value = null;
            formResponseMessage.value = null;
            formErrors.value = null;
            formErrorsMessage.value = null;
			newUserData.id = user.value.id;

            if (
                JSON.stringify(newUserData) ===
                JSON.stringify(user.value)
            ) {
                letGo = false;
                formErrorsMessage.value = "Your data are the same.";
            } else {
                letGo = true;
            }

            if (letGo) {
                document
                    .querySelector("#spinner-button")
                    .classList.add("spinner-border", "spinner-border-sm");
                document
                    .querySelector("#submit-button")
                    .classList.add("disabled");
                document.querySelector("#submit-text").textContent = "Loading";
                let i = 0;
                setInterval(() => {
                    if (
                        i >= 3 ||
                        formErrors.value ||
                        formResponseMessage.value
                    ) {
                        clearInterval();
                    } else {
                        i++;
                        document.querySelector("#submit-text").textContent +=
                            ".";
                    }
                }, 400);

                store
                    .dispatch("saveChanges", newUserData)
                    .then((res) => {
                        formResponse.value = res;
                        formResponseMessage.value = res.data.message;
                        localUserData.value = {
                            first_name: res.data.user.first_name,
                            nick: res.data.user.nick,
                            last_name: res.data.user.last_name,
                            email: res.data.user.email,
                            gender: res.data.user.gender,
                        };
                    })
                    .catch((err) => {
						console.log('error change data');
						console.log(err);
                        formErrors.value = err.data.errors;
                        formErrorsMessage.value = err.data.message;
                    })
                    .finally(() => {
                        clearInterval();
                        document
                            .querySelector("#spinner-button")
                            .classList.remove(
                                "spinner-border",
                                "spinner-border-sm"
                            );
                        document
                            .querySelector("#submit-button")
                            .classList.remove("disabled");
                        document.querySelector("#submit-text").textContent =
                            "Save changes";
                    });
            }
        };

        onMounted(() => {
            document.title = `Preferences`;
            if (typeof user.value == "object") {
                localUserData.value = { ...user.value };
            }
            if (typeof user.value != "object") {
                router.replace({
                    name: "user",
                    query: { redirect: route.fullPath },
                });
            }
        });

        return {
            localUserData,
            showModal,
            formErrors,
            formErrorsMessage,
            formResponseMessage,
            closeModal,
            user,
            saveChanges,
			checkGender
        };
    },
};
</script>

<style>
p.is-invalid {
    border: 1px solid #dc3545 !important;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(1.5rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

p.is-valid {
    border: 1px solid #198754 !important;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(1.5rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
</style>
