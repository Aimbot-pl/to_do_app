import { createStore } from 'vuex'
import account from './components/modules/account'
import products from './components/modules/products'

const store = createStore({
    modules: {
        account,
        products
    },
})

export default store