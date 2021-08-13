import { createRouter, createWebHistory } from 'vue-router'
const notFound = {template: '<h1>Not found</h1>'}

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: notFound,
    },
    {
        path: '/',
        name: 'home',
        component: () => import('./views/Home.vue'),
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('./views/Tasks.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./views/Register.vue'),
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: { template: '<div>link</div>'},
    },
];

const router = new createRouter({
    history: createWebHistory(),
    routes
});

export default router
