import { createStore } from 'vuex'
import account from './components/modules/account'
import register from './components/modules/register'

const store = createStore({
    modules: {
        account,
        register,
    },
})

export default store