import axios from 'axios';

export default {
    state() {
        return {
            registeringIn: false
        }
    },
    getters: {
        registerErrors(state) {
            return state.registerError;
        },
    },
    mutations: {
        registerStart: state => state.registeringIn = true,
        registerStop(state, errorMessage) {
            state.registeringIn = false;
        },
    },
    actions: {
        signUp({commit}, credentials) {
            return new Promise((resolve, reject) => {
                commit('registerStart')
                axios
                    .post("/api/v1/register", {
                        nick: credentials.nick,
                        first_name: credentials.first_name,
                        last_name: credentials.last_name,
                        email: credentials.email,
                        password: credentials.password,
                        password_confirmation: credentials.password_confirmation,
                        gender: credentials.gender,
                    }
                ).then((res) => {
                    commit('registerStop', res)
                    resolve(res);
                }).catch((err) => {
                    commit('registerStop', err)
                    reject(err.response)
                })

            });
        }
    }
}