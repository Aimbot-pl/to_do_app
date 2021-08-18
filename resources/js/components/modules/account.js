import router from '../../router'
export default {
    state() {
        return {
            accessToken: null,
            loggingIn: false,
            loginError: null,
            userId: null,
            userData: null,
            userFetching: false,
            userError: null,
        }
    },
    getters: {
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
        loginStart: state => state.loggingIn = true,
        loginStop(state, errorMessage) {
            state.loggingIn = false
            state.loginError = errorMessage
        },
        logout(state) {
            sessionStorage.clear()
            state.accessToken = null,
            state.userId = null
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
        fetchData(state, userData) {
            state.userData = {...userData.data}
        }
    },
    actions: {
        login({commit, state}, credentials) {
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
				})
				.catch((err) => {
                    commit('loginStop', err.response.data.message)
                    commit('updateAuth', {
                        accessToken: null,
                        userId: null
                    })
				});
        },
        logout({commit}) {
            commit('logout')
            router.replace('/login')
        },
        fetchAuth({commit}) {
            commit('updateAuth', {
                accessToken: sessionStorage.getItem('accessToken'), 
                userId: sessionStorage.getItem('userId')
            })
        },
        fetchUserData({state, commit}) {
            commit('fetchingStart')
            axios.get('/api/user/'+state.userId)
                .then((res) => {
                    commit('fetchingStop', null)
                    commit('fetchData', res.data)
                    console.log(state.userData)
                })
                .catch((err) => {
                    console.log(err)
                    commit('fetchingStop', err)
                    commit('fetchData', null)
                })
        },
        saveChanges({state, commit, dispatch}, submittedData) {
            return dispatch('fetchUserData').then(() => {
                if (JSON.stringify(state.userData) === JSON.stringify(submittedData)) {
                    state.userError.message = 'Data already exists '
                } else {
                    axios.put('/api/user/'+state.userId, {...submittedData})
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((err) => {
                            console.log(err.response)
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