import axios from 'axios'
import router from '../../router'
export default {
    state() {
        return {
            registerngIn: false,
            registerError: null,
            accessToken: null,
            loggingIn: false,
            loginError: null,
            userId: null,
            userData: null,
            userFetching: false,
            userError: undefined,
        }
    },
    getters: {
        registerErrors(state) {
            return state.registerError
        },
        loginErrors(state) {
            return state.loginError
        },
        userId(state) {
            return state.userId
        },
        accessToken(state) {
            return state.accessToken
        },
        userData(state) {
            return state.userData
        },
        userErrors(state) {
            return state.userError
        }
    },
    mutations: {
        registerStart: state => state.registeringIn = true,
        registerStop(state, errorMessage) {
            state.registerngIn = false
            if (typeof errorMessage === 'string' || errorMessage instanceof String) {
                state.registerError = errorMessage
            } else {
                state.registerError = {...errorMessage.errors, message: errorMessage.message}
            }
        },
        loginStart: state => state.loggingIn = true,
        loginStop(state, errorMessage) {
            state.loggingIn = false
            state.loginError = errorMessage
        },
        logout(state) {
            sessionStorage.clear()
            state.accessToken = null
            state.userId = null
            state.userData = null
        },
        updateAuth(state, payload) {
            state.accessToken = payload.accessToken
            state.userId = payload.userId
        },
        fetchingStart: state => state.userFetching = true,
        fetchingStop(state, error) {
            state.userFetching = false
            state.userError = error
        },
        cleanLoginErrors(state) {
            state.loginError = null
        },
        fetchData(state, userData) {
            if (userData) {
                state.userData = { ...userData.data }
            } else {
                state.userData = userData
            }
        }
    },
    actions: {
        signUp({commit}, credentials) {
            commit('registerStart')
            console.log(credentials)
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
        login({ commit, state }, credentials) {
            commit('loginStart')
            axios.post("/api/login", {
                email: credentials.username,
                password: credentials.password,
            })
                .then((res) => {
                    sessionStorage.setItem('accessToken', res.data.token);
                    sessionStorage.setItem('userId', res.data.id)
                    commit('loginStop', null)
                    commit('updateAuth', {
                        accessToken: sessionStorage.getItem('accessToken'),
                        userId: sessionStorage.getItem('userId')
                    })
                    return state.userId
                })
                .catch((err) => {
                    commit('loginStop', err.response.data.message)
                    commit('updateAuth', {
                        accessToken: null,
                        userId: null
                    })
                });
        },
        doCleanLoginErrors({ commit }) {
            commit('cleanLoginErrors')
        },
        logout({ commit }) {
            commit('logout')
            router.replace({ name: 'home' })
        },
        fetchAuth({ commit }) {
            commit('updateAuth', {
                accessToken: sessionStorage.getItem('accessToken'),
                userId: sessionStorage.getItem('userId')
            })
        },
        fetchUserData({ state, commit }) {
            commit('fetchingStart')
            console.log('fetchingStart')
            axios({
                method: 'get',
                url: `/api/user/${state.userId}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${state.accessToken}`
                }
            })
                .then((res) => {
                    commit('fetchingStop', null)
                    commit('fetchData', res.data)
                })
                .catch((err) => {
                    console.log(err.response)
                    commit('fetchingStop', err.response.data)
                    commit('fetchData', null)
                    if (state.userError.message === "Unauthenticated.") {
                        router.replace({ path: '/login' })
                    }
                })
        },
        saveChanges({ state, commit, dispatch }, submittedData) {
            return dispatch('fetchUserData').then(() => {
                console.log(JSON.stringify(state.userData) === JSON.stringify(submittedData))
                if (JSON.stringify(state.userData) === JSON.stringify(submittedData)) {
                    state.userError = { message: 'Data already exists ' }
                } else if (!submittedData) {
                    state.userError = { message: 'Given data is empty' }
                } else {
                    commit('fetchingStart')
                    axios.get('/sanctum/csrf-cookie').then(() => {
                        axios({
                            method: 'put',
                            url: `/api/user/${state.userId}`,
                            data: {
                                ...submittedData
                            },
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${state.accessToken}`
                            }
                        })
                            .then((res) => {
                                console.log(res)
                                commit('fetchingStop', null)
                                commit('fetchData', res.data)
                            })
                            .catch((err) => {
                                console.log(err.response)
                                commit('fetchingStop', err)
                                commit('fetchData', null)
                            })
                    })

                }
            })
        },
        togglePassword(input, button) {
            if (input.type === "password") {
                input.type = 'text'
                button.classList.value = 'btn btn-success'
                button.textContent = 'Hide'
            } else {
                input.type = 'password'
                button.classList.value = 'btn btn-outline-success'
                button.textContent = 'Show'
            }
        }
    },


}