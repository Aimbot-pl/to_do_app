import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
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
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('./views/Tasks.vue'),
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
            store.dispatch('fetchUserData')
            store.dispatch('fetchAuth')
            if (store.state.account.accessToken && store.state.account.user && to.params.user === store.state.account.user.nick) {
                next()
            } else {
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }
                })
            }
        },
        children: [
            {
                path: '',
                name: 'profile',
                component: () => import('./components/account/Profile.vue')
            },
            {
                path: 'preferences',
                name: 'settings',
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
                ]
            },
        ]
    },

    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: { template: '<div>link</div>' },
    },
    {
        path: '/test-second',
        name: 'testSecond',
        component: () => import('./components/TestSecond.vue'),
    },
    {
        path: '/tasks',
        component: () => import('./views/Tasks.vue')
    }
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

export default router
