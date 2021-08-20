import axios from 'axios';

export default {
    state() {
        return {
            registeringIn: false,
            registerError: null,
        }

    },
    getters: {
        registerErrors(state) {
            return state.registerError
        },
    },
    mutations: {
        registerStart: state => state.registeringIn = true,
        registerStop(state, errorMessage) {
            state.registeringIn = false
            if (typeof errorMessage === 'string' || errorMessage instanceof String) {
                state.registerError = errorMessage
            } else {
                state.registerError = {...errorMessage.errors, message: errorMessage.message}
            }
        },
    },
    actions: {
        signUp({commit}, credentials) {
            commit('registerStart')
            axios
                .post("/api/register", {
                    nick: credentials.nick,
                    first_name: credentials.first_name,
                    last_name: credentials.last_name,
                    email: credentials.email,
                    password: credentials.password,
                    password_confirmation: credentials.password_confirmation,
                    gender: credentials.gender,
                }
            ).then((res) => {
                commit('registerStop', res.data.message)
            }).catch((err) => {
                commit('registerStop', err.response.data)
            })
        },
    }
}