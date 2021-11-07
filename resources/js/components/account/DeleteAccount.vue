<template>
    <h1 class="text-center text-warning my-3">Delete account</h1>
    <h6 class="text-danger">
        Once you delete your account, there is no going back. Please be certain.
    </h6>

    <div class="d-flex justify-content-center mt-4">
        <button
            type="submit"
            id="deleteAccountModalButton"
            class="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#deleteAccountModal"
            @click="toggleModal(true)"
        >
            Delete your account
        </button>
    </div>

    <div
        class="modal fade"
        id="deleteAccountModal"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="deleteAccountModalButton"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Are you sure you want to do this?</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body px-0 pt-0">
                    <div class="alert alert-warning d-flex align-items-center" role="alert">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                            
                            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </symbol>
                        </svg>
                        <div>
                                This is extremely important. 
                        </div>
                    </div>
                    <div class="notes px-4">
                        <p>We will immediately delete all of your repositories (10), along with all of your forks, wikis, issues, pull requests, and GitHub Pages sites. </p>
                        <p>You will no longer be billed, and your username will be available to anyone on this site. </p>
                        <p>For more help, read our article " <a href="#">Deleting your user account</a> ". </p>
                    </div>

                    <form
                        @submit.prevent="changePassword(localUserData)"
                        class="mx-auto px-4"
                    >
                        

                        <div class="row mb-3">
                            <label for="email" class="form-label"
                                >Enter email</label
                            >
                            <div class="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    class="form-control"
                                    v-model="localUserData.email"
                                />
                            </div>
                            <div v-if="formErrors && formErrors.email">
                                <p
                                    v-for="error in formErrors.email"
                                    :key="error"
                                    class="invalid-feedback d-block m-0"
                                >
                                    {{ error }}
                                </p>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="confirm" class="form-label"
                                >To verify, type
                                <i>delete my account</i> below:</label
                            >
                            <div class="input-group">
                                <input
                                    type="text"
                                    name="confirm"
                                    id="confirm"
                                    class="form-control"
                                    :class="[
                                        formErrors && formErrors.confirm
                                            ? 'is-invalid'
                                            : '',
                                        formErrors &&
                                        Object.keys(formErrors).length &&
                                        !formErrors.confirm
                                            ? 'is-valid'
                                            : '',
                                    ]"
                                    v-model="localUserData.confirm"
                                    ref="confirm"
                                />
                            </div>
                            <div v-if="formErrors && formErrors.password">
                                <p
                                    v-for="error in formErrors.password"
                                    :key="error"
                                    class="invalid-feedback d-block m-0"
                                >
                                    {{ error }}
                                </p>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="form-label"
                                >Confirm your password</label
                            >
                            <div class="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    class="form-control"
                                    :class="[
                                        formErrors && formErrors.password
                                            ? 'is-invalid'
                                            : '',
                                        formErrors &&
                                        Object.keys(formErrors).length &&
                                        !formErrors.password
                                            ? 'is-valid'
                                            : '',
                                    ]"
                                    v-model="localUserData.password"
                                    ref="password"
                                />

                                <button
                                    class="password-button bi bi-eye-slash"
                                    type="button"
                                    ref="password_button"
                                    @click.prevent="
                                        togglePassword(
                                            $refs.password,
                                            $refs.password_button
                                        )
                                    "
                                ></button>
                            </div>
                            <div v-if="formErrors && formErrors.password">
                                <p
                                    v-for="error in formErrors.password"
                                    :key="error"
                                    class="invalid-feedback d-block m-0"
                                >
                                    {{ error }}
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer d-flex justify-content-around">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="submit-button"
                        class="btn btn-danger disabled"
                    >
                        Delete your account
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import togglePassword from "../../helpers/TogglePassword";
export default {
    name: "Change password",
    setup() {
        const store = useStore();

        const errorss = ref({});
        const showModal = ref(false);
        const formErrors = ref({});
        const formErrorsMessage = ref(null);
        const formResponseMessage = ref(null);
        const responsee = ref({});
        const errors = ref({});

        const localUserData = ref({});
        localUserData.value = {
            email: "",
            password: "",
            confirmation: "",
        };

        const toggleModal = (state) => {
            showModal.value = state;
        };

        return {
            localUserData,
            errorss,
            formErrors,
            formErrorsMessage,
            formResponseMessage,
            responsee,
            errors,
            toggleModal,
            showModal,
            ...togglePassword,
        };
    },
};
</script>

<style>
.password-button {
    left: calc(100% - 70px);
    z-index: 1000000000000;
}
</style>
