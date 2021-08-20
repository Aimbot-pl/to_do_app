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
        }
    },
    getters: {
        loginErrors(state) {
            return state.loginError
        },
        userId(state) {
            return state.user.id
        },
        accessToken(state) {
            return state.accessToken
        },
        user(state) {
            return state.user
        },
        userErrors(state) {
            return state.userError
        },
    },
    mutations: {
        loginStart: state => state.loggingIn = true,
        loginStop(state, errorMessage) {
            state.loggingIn = false
            state.loginError = errorMessage
        },
        logout(state) {
            sessionStorage.clear()
            state.accessToken = null
            state.user = null
        },
        updateAuth(state, payload) {
            state.accessToken = payload.accessToken
            state.user = payload.user
        },
        fetchingStart: state => state.userFetching = true,
        fetchingStop(state, error) {
            state.userFetching = false
            state.userError = error
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
            axios.post("/api/login", {
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
            console.log('updating started')
            commit('updateAuth', {
                accessToken: sessionStorage.getItem('accessToken'),
                user: JSON.parse(sessionStorage.getItem('user'))
            })
            console.log('updating finished')
        },
        fetchUserData({ state, commit}) {
            commit('fetchingStart')
            console.log('fetching start')
            if (state.user) {

                axios({
                    method: 'get',
                    url: `/api/user/${state.user.id}`,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${state.accessToken}`
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    commit('fetchingStop', null)
                    commit('fetchData', res.data)
                })
                .catch((err) => {
                    commit('fetchingStop', err.response.data)
                    commit('fetchData', null)
                    if (state.userError.message === "Unauthenticated.") {
                        router.replace({ path: '/login' })
                    }
                }).finally(() => console.log('fetching finished'))
            } else {
                commit('logout') 
                router.replace({name: 'login'})
            }
            },
            saveChanges({ state, commit, dispatch }, submittedData) {
                return dispatch('fetchUserData').then(() => {
                    console.log('fetched')
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
                            url: `/api/user/${state.user.id}`,
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
        changePassword({commit}, credentials) {
            
        }
    },


}