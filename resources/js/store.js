import { createStore } from 'vuex';
import account from './components/modules/storeAccount';

const store = createStore({
    modules: {
        account
    },
});

export default store;