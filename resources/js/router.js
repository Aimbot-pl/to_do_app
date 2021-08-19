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
        path: '/users/:id',
        name: 'user',
        component: () => import('./views/User.vue'),
        beforeEnter: (to, from, next) => {
            store.dispatch('fetchAuth')
            if (store.state.account.accessToken && store.state.account.userId && to.params.id === store.state.account.userId) {
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
                path: '/users/:id/settings',
                name: 'Settings',
                component: () => import('./views/Settings.vue'),
            },
        ] 
    },

    {
        path: '/forgot-password',
            name: 'forgotPassword',
                component: { template: '<div>link</div>' },
    },
    {
        path: '/test',
            name: 'test',
                component: () => import('./components/Test.vue'),
        },
    {
        path: '/test-second',
            name: 'testSecond',
                component: () => import('./components/TestSecond.vue'),
    },
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

export default router
