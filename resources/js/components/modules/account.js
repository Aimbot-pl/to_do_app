import axios from 'axios'
import router from '../../router'
export default {
    state() {
        return {
            accessToken: null,
            loggingIn: false,
            loginError: null,
            user: null,
            userFetching: false,
            userError: undefined,
            showPage: true,
            changingPassword: false,
            changePasswordError: null,
            message: null,
        }
    },
    getters: {
        loginErrors(state) {
            return state.loginError;
        },
        userId(state) {
            return (state.user && state.user.id) ? state.user.id : null;
        },
        accessToken(state) {
            return state.accessToken;
        },
        user(state) {
            return state.user || null;
        },
        userErrors(state) {
            return state.userError;
        },
        changePasswordErrors(state) {
            return state.changePasswordError;
        },
        message(state) {
            return state.message;
        },
    },
    mutations: {
        loginStart: state => state.loggingIn = true,
        loginStop(state, errorMessage) {
            state.loggingIn = false;
            state.userId = (errorMessage && errorMessage.id) ? errorMessage.id : null;
            state.loginError = errorMessage;
        },
        logout(state) {
            sessionStorage.clear()
            state.accessToken = null;
            state.user = null;
            state.userId = null;
        },
        updateAuth(state, payload) {
            state.accessToken = payload.accessToken
            state.user = payload.user
        },
        fetchingStart(state) { 
            state.userFetching = true
            state.message = null
        },
        fetchingStop(state, error) {
            state.userFetching = false
            state.userError = error
        },
        changePasswordStop(state, error) {
            state.userFetching = false
            state.changePasswordError = { 
                ...error.errors, 
                message: error.message 
            }

        },
        cleanLoginErrors(state) {
            state.loginError = null
        },
        fetchData(state, user) {
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user.data))
                state.user = { ...user.data }
            } else {
                state.user = user
            }
        },
    },
    actions: {
        login({ commit, state }, credentials) {
            commit('loginStart')
            axios.get('/sanctum/csrf-cookie').then(() => {
                axios.post("/api/v1/login", {
                    email: credentials.username,
                    password: credentials.password,
                })
                    .then((res) => {
                        sessionStorage.setItem('accessToken', res.data.token);
                        sessionStorage.setItem('user', JSON.stringify(res.data.user))
                        commit('loginStop', null)
                        commit('updateAuth', {
                            accessToken: sessionStorage.getItem('accessToken'),
                            user: JSON.parse(sessionStorage.getItem('user'))
                        })
                        return state.userId
                    })
                    .catch((err) => {
                        commit('loginStop', err.response.data.message)
                        commit('updateAuth', {
                            accessToken: null,
                            user: null
                        })
                    });
            })
        },
        doCleanLoginErrors({ commit }) {
            commit('cleanLoginErrors')
        },
        logout({ commit }) {
            commit('logout')
            setTimeout(() => {

                router.replace({ name: 'home' })
            }, 1000)
        },
        fetchAuth({ commit }) {
            // console.log('updating started')
            commit('updateAuth', {
                accessToken: sessionStorage.getItem('accessToken'),
                user: JSON.parse(sessionStorage.getItem('user'))
            })
            // console.log('updating finished')
        },
        fetchUserData({ state, commit }) {
            commit('fetchingStart')
            // console.log('fetching start')
            if (state.user) {

                axios({
                    method: 'get',
                    url: `/api/v1/user/${state.user.id}`,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${state.accessToken}`
                    }
                })
                    .then((res) => {
                        // console.log(res.data)
                        commit('fetchingStop', null)
                        commit('fetchData', res.data)
                    })
                    .catch((err) => {
                        commit('fetchingStop', err.response.data)
                        commit('fetchData', null)
                        if (state.userError.message === "Unauthenticated.") {
                            router.replace({ path: '/login' })
                        }
                    })
                // .finally(() => console.log('fetching finished'))
            } else {
                commit('logout')
                router.replace({ name: 'login' })
            }
        },
        saveChanges({ state, commit, dispatch }, submittedData) {
            return dispatch('fetchUserData').then(() => {
                // console.log('fetched')
                console.log(state.user.id)
                if (JSON.stringify(state.userError) === JSON.stringify(submittedData)) {
                    state.userError = { message: 'Data already exists ' }
                } else if (!submittedData) {
                    state.userError = { message: 'Given data is empty' }
                } else {
                    commit('fetchingStart')
                    axios.get('/sanctum/csrf-cookie').then(() => {
                        axios({
                            method: 'put',
                            url: `/api/v1/user/${state.user.id}`,
                            data: {
                                ...submittedData
                            },
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
                                commit('fetchingStop', err)
                                commit('fetchData', null)
                            })
                    })

                }
            })
        },
        changePassword({ state, getters, commit }, credentials) {
            console.log(credentials)
            let returnValue = null;
            state.changePasswordError = null
            let errors = null
            if (credentials.new_password !== credentials.new_password_confirmation) {
                errors = {
                    ...errors,
                    new_password_confirmation: ['Passwords are not matching']
                }
            }
            if (errors === getters.changePasswordErrors) {
                commit('fetchingStart')
                axios.get('/sanctum/csrf-cookie').then(
                    axios({
                        method: 'put',
                        url: `/api/v1/user/${state.user.id}/change-password`,
                        data: {
                            ...credentials
                        },
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${state.accessToken}`
                        }
                    }).then(res => {
                        console.log(res)
                        state.message = res.data.message
                        commit('changePasswordStop', {errors: null, message: null})

                    }).catch(err => {
                        console.log(err.response)
                        commit('changePasswordStop', err.response.data)
                    })
                )
            } else {
                state.changePasswordError = errors
            }

        }
    },


}