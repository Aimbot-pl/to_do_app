import axios from 'axios'
import Cookies from 'js-cookie';
import router from '../../router'

export default {
    state() {
        return {
            user: null,
            signingIn: false,
            response: null,
            errors: null,
            alertMessage: null,
            executeAction: null,
        }
    },
    getters: {
        user(state)
        {
            return state.user;
        },
        errorsData(state)
        {
            return state.errors && state.errors.hasOwnProperty('data') ? state.errors.data : null;
        },
        responseData(state)
        {
            return state.response && state.response.hasOwnProperty('data') ? state.response.data : null;
        },
        alertMessage(state) 
        {
            return state.alertMessage;
        }
    },
    mutations: {
        updateUser(state, data) 
        {
            if (data == null) {
                state.user = null;
            } else {
                if (typeof data.user != 'undefined') {
                    if (typeof data.user === 'object') {
                        state.user = data.user;
                    } else if (typeof data.user === 'string') {
                        state.user = JSON.parse(data.user);
                    }
                }
            }
        },
        updateAuth({state}, auth) 
        {
            Cookies.set('accessToken', auth.accessToken, { expires: 2/(24*60) });
            Cookies.set('refreshToken', auth.refreshToken, { expires: 7 });
            Cookies.set('user', JSON.stringify(auth.user), { expires: 7 });
        },
        startLogin(state) 
        {
            state.signingIn = true;
        },
        stopLogin(state, res)
        {
            state.signingIn = false;
            state.response = res && res.hasOwnProperty('response') ? res.response : null;
            state.errors = res && res.hasOwnProperty('errors') ? res.errors : null;
        },
        setAlertMessage(state, res) 
        {
            state.alertMessage = res;
        },
        clearAlertMessage(state) 
        {
            state.alertMessage = null;
        },
        setAction(state, action) 
        {
            state.executeAction = action;
        },
        clearAction(state) 
        {
            state.executeAction = null;
        }
    },
    actions: {
        fetchUser({commit}) 
        {
            return new Promise(resolve => {
                commit('updateUser', {
                    user: Cookies.get('user')
                });
                resolve();
            });
        },
        fetchAuth({state, commit}) 
        {
            return new Promise((resolve, reject) => {
                commit('startLogin');
                axios.post('/api/v1/refresh-token', {
                    accessToken: Cookies.get('accessToken'),
                    refreshToken: Cookies.get('refreshToken'),
                    userId: state.user && state.user.id ? state.user.id : null
                })
                .then((res) => {
                    commit('stopLogin', res, null);
                    commit('updateAuth', {
                        refreshToken: res.data.refreshToken,
                        accessToken: res.data.accessToken,
                        user: res.data.user
                    });
                    resolve(res);
                })
                .catch((err) => {
                    commit('stopLogin', null, err.response);
                    reject(err.response);
                });
            });
        },
        login({commit}, credentials) 
        {
            return new Promise((resolve, reject) => {
                axios.get('/api/v1/csrf-cookie')
                .then(() => {
                    commit('startLogin');
                    axios.post('/api/v1/login', 
                        {
                            email: credentials.username,
                            password: credentials.password
                        }
                    )
                    .then(res => {
                        commit('updateAuth', {
                            refreshToken: res.data.refreshToken,
                            accessToken: res.data.accessToken,
                            user: res.data.user
                        });
                        commit('stopLogin', {response: res, errors: null});
                        resolve(res);
                    })
                    .catch(err => {
                        commit('stopLogin', {response: null, errors: err.response});
                        commit('setAlertMessage', {class: "danger", message: err.response.data.message});
                        reject(err.response);
                    });
                })
                .catch(err => {
                    commit('stopLogin', {response: null, errors: err.response});
                    reject(err.response);
                });
            });
        },
        logout({commit, dispatch})
        {
            return new Promise((resolve, reject) => {
                dispatch('fetchAuth').then((res) => {
                    commit('startLogin');
                    axios.post('/api/v1/logout', {}, {
                        headers: {
                            Authorization: `Bearer ${res.data.accessToken}`
                        }
                    })
                    .then((res) => {
                        commit('stopLogin', null, null);
                        commit('updateUser', null);
                        Cookies.remove('accessToken');
                        Cookies.remove('refreshToken');
                        Cookies.remove('user');
                        router.replace({
                            name: 'home',
                            params: {
                                routeAlert: JSON.stringify({
                                    message: res.data.message,
                                    class: 'warning'
                                })
                            }
                        });
                    })
                })
            });
        },
        saveChanges({state, commit, dispatch}, currentUserData) 
        {
            return new Promise((resolve, reject) => {
                if (JSON.stringify({...currentUserData, id: state.user.id}) === JSON.stringify(state.user)) {
                    commit('stopLogin', {response: null, errors: { data: { message: 'Your data are the same.'}}} );
                    reject({message: 'Your data are the same.'});
                } else {

                    dispatch('fetchAuth')
                    .then((res) => {
                        axios.put(
                            `/api/v1/user/${state.user.id}`, 
                            {
                                id: state.user.id,
                                nick: currentUserData.nick,
                                email: currentUserData.email,
                                first_name: currentUserData.first_name,
                                last_name: currentUserData.last_name,
                                gender: currentUserData.gender
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${Cookies.get('accessToken')}`
                                }
                            }
                        )
                        .then(res => {
                            commit('updateUser', res.data);
                            commit('stopLogin', {response: res, errors: null});
                            resolve(res);
                        })
                        .catch(err => {
                            commit('stopLogin', {response: null, errors: err.response});
                            reject(err.response);
                        })
                    })
                    .catch((err) => {
                        console.log(err.response);
                        reject(err.response);
                    })
                    // commit('stopLogin', {response: {data: {message: 'Update successfull'}}, errors: null});
                    // resolve({message: 'Update successfull'});
                }
            });
        },
        changePassword({state, commit, dispatch}, currentUserData) 
        {
            return new Promise((resolve, reject) => {
                    dispatch('fetchAuth')
                    .then((res) => {
                        axios.put(
                            `/api/v1/user/${state.user.id}/change-password`, 
                            {
                                old_password: currentUserData.old_password,
                                new_password: currentUserData.new_password,
                                new_password_confirmation: currentUserData.new_password_confirmation
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${Cookies.get('accessToken')}`
                                }
                            }
                        )
                        .then(res => {
                            commit('updateUser', res.data);
                            commit('stopLogin', {response: res, errors: null});
                            resolve(res);
                        })
                        .catch(err => {
                            commit('stopLogin', {response: null, errors: err.response});
                            reject(err.response);
                        })
                    });
                
            }); 
        },
        register({state, commit, dispatch}, userData) 
        {
            return new Promise((resolve, reject) => {
                axios.get('/sanctum/csrf-cookie')
                .then(() => {
                    commit('startLogin');
                    axios.post(
                        '/api/v1/register',
                        {
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            email: userData.email,
                            nick: userData.nick,
                            password: userData.password,
                            password_confirmation: userData.password_confirmation,
                            gender: userData.gender
                        }
                    )
                    .then((res) => {
                        commit('stopLogin', {response: res, errors: null});
                        commit('setAlertMessage', {class: "success", message: res.data.message});
                        resolve(res);
                    })
                    .catch((err) => {
                        commit('stopLogin', {response: null, errors: err.response});
                        reject(err.response);
                    });
                })
                .catch(err => {
                    reject(err.response);
                })
            });
        },
        deleteAccount({state, commit, dispatch}, userData)
        {
            return new Promise((resolve, reject) => {
                dispatch('fetchAuth')
                .then(response => {
                    commit('startLogin');
                    axios.post('/api/v1/delete-account', {
                        email: userData.email,
                        password: userData.password
                    }, {
                        headers: {
                            Authorization: `Bearer ${response.data.accessToken}`
                        }
                    })
                    .then(res => {
                        commit('stopLogin', {response: res, errors: null});
                        commit('updateUser', null);
                        bootstrap.Modal.getInstance(document.querySelector('#deleteAccountModal')).hide();
                        Cookies.remove('accessToken');
                        Cookies.remove('refreshToken');
                        Cookies.remove('user');
                        resolve(res);
                    })
                    .catch(err => {
                        commit('stopLogin', {response: null, errors: err.response});
                        reject(err.response);
                    }); 
                });
            });
        }
    }
};