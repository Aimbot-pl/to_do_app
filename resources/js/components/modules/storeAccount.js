import axios from 'axios'
import Cookies from 'js-cookie';
import router from '../../router'

export default {
    state() {
        return {
            user: null,
            signingIn: false,
            response: null,
            errors: null
        }
    },
    getters: {
    },
    mutations: {
        // Login user
        updateUser(state, data) 
        {
            if (typeof data.user != 'undefined'){
            if (typeof data.user === 'object') {
                state.user = data.user;
            } else if (typeof data.user === 'string') {
                state.user = JSON.parse(data.user);
            }}
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
        stopLogin(state, response, errors)
        {
            state.signingIn = false;
            state.response = response;
            state.errors = errors;
        }
    },
    actions: {
        fetchUser({commit}) {
            return new Promise(resolve => {
                commit('updateUser', {
                    user: Cookies.get('user')
                });
                resolve();
            });
        },
        fetchAuth({commit}) {
            return new Promise((resolve, reject) => {
                commit('startLogin');
                axios.post('/api/v1/refresh-token', {
                    accessToken: Cookies.get('accessToken'),
                    refreshToken: Cookies.get('refreshToken'),
                    userId: JSON.parse(Cookies.get('user')).id
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
        login({commit}, credentials) {
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
                        commit('stopLogin',res, null);
                        resolve(res);
                    })
                    .catch(err => {
                        commit('stopLogin', null, err.response);
                        reject(err.response);
                    });
                })
                .catch(err => {
                    commit('stopLogin', null, err.response);
                    reject(err.response);
                });
            });
        }
    }
};