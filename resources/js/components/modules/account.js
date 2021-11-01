import axios from 'axios'
import Cookies from 'js-cookie';
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
            Cookies.remove('accessToken');
            Cookies.remove('user');
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
                state.user = { ...user.data }
            } else {
                state.user = user
            }
        },
    },
    actions: {
        login({ commit }, credentials) {
            return new Promise((resolve, reject) => {   
                commit('loginStart')
                axios.get('/sanctum/csrf-cookie').then(() => {
                    axios.post("/api/v1/login", {
                        email: credentials.username,
                        password: credentials.password,
                    })
                    .then((res) => {
                        Cookies.set('accessToken', res.data.token, {expires: 2/(60*24)}); // 2 minutes
                        Cookies.set('refreshToken', res.data.refreshToken, {expires: 7});
                        Cookies.set('user', JSON.stringify(res.data.user));
                        // sessionStorage.setItem('accessToken', res.data.token);
                        // sessionStorage.setItem('user', JSON.stringify(res.data.user))
                        commit('loginStop', null)
                        commit('updateAuth', {
                            accessToken: res.data.token,
                            refreshToken: res.data.refreshToken,
                            user: res.data.user
                        })
                        resolve(res.data.user);
                    })
                    .catch((err) => {
                        commit('loginStop', err.response.data.message)
                        commit('updateAuth', {
                            accessToken: null,
                            user: null
                        })
                        reject(err);
                    });
                });

            })
        },
        doCleanLoginErrors({ commit }) {
            commit('cleanLoginErrors')
        },
        logout({ commit, state }) {
            axios({
                method: 'post',
                url: '/api/v1/logout',
                headers: {
                    Authorization: `Bearer ${state.accessToken}`
                }
            }).finally(() => {
                commit('logout');
                router.replace({ name: 'home' })
            });
        },
        fetchAuth({ commit }) {
            commit('updateAuth', {
                accessToken: Cookies.get('accessToken') || null,
                user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null
            })
        },
        async fetchUserData({ state, commit }) {
            commit('fetchingStart')
            if (state.user) {
                axios.post('/api/v1/refresh-token',{
                    refresh_token: Cookies.get('refreshToken'),
                    access_token: Cookies.get('accessToken'),
                    user_id: state.user.id
                })
                .then((res) => {
                    Cookies.set('accessToken', res.data.access_token, {expires: 2/(60*24)});
                    Cookies.set('refreshToken', res.data.refresh_token, {expires: 7});
                    Cookies.set('user', JSON.stringify(res.data.user));
                    axios.get(`/api/v1/user/${res.data.user.id}`, {}, {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${res.data.access_token}`
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
                        });
                    })
                    .catch((res) => {
                        console.log('session expired!', res);
                    });
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