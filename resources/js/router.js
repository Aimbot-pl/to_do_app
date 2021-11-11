import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import Cookies from 'js-cookie';
const notFound = { template: '<h1>Not found</h1>' }

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: notFound,
    },
    {
        path: '/',
        name: 'home',
        alias: '/home',
        component: () => import('./views/Home.vue'),
        props: true,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./views/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./views/Register.vue'),
    },
    {
        path: '/user/:user',
        name: 'user',
        component: () => import('./views/User.vue'),
        beforeEnter: (to, from, next) => {
            store.dispatch('fetchUser');
            store.dispatch('fetchAuth')
            .then(res => {
                if (Cookies.get('accessToken') && JSON.parse(Cookies.get('user')) && to.params.user == JSON.parse(Cookies.get('user')).nick) {
                    next();
                } else {
                    next({
                        name: 'login',
                        query: {
                            redirect: to.fullPath
                        }
                    })
                }
            })
            .catch(() => {
                next({
                    name: 'login',
                    query: {
                        redirect: to.fullPath
                    }
                })
            })
        },
        children: [
            {
                path: '',
                name: 'profile',
                component: () => import('./components/account/Profile.vue')
            },
            {
                path: 'preferences',
                name: 'preferences',
                component: () => import('./components/account/Preferences.vue'),
                children: [
                    {
                        path: 'change-data',
                        name: 'changeData',
                        component: () => import('./components/account/ChangeData.vue'),
                    },
                    {
                        path: 'change-password',
                        name: 'changePassword',
                        component: () => import('./components/account/ChangePassword.vue'),
                    },
                    {
                        path: 'delete-account',
                        name: 'deleteAccount',
                        component: () => import('./components/account/DeleteAccount.vue'),
                    },
                ]
            },
        ]
    },

    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: { template: '<div>link</div>' },
    },
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(() => {
    store.commit('setAction', 'clearAlertMessage');
})


export default router
