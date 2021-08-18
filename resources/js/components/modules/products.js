import shop from '../shop'
export default {
    state() {
        return {
            products: shop._products,
            cart: [],
        }
    },
    getters: {
        cartProducts(state) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id)
                return {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity
                }
            })
        },
        total(state, getters) {
            return getters.cartProducts.reduce((total, item) => total + item.quantity * item.price,0).toFixed(2)
        }  
    },
    actions: {
        addProductToCart(context, product) {
            if (product.inventory > 0) {
                const cartItem = context.state.cart.find(item => item.id === product.id)
                if (!cartItem) {
                    context.commit('pushProductToCart', product.id)
                } else {
                    context.commit('incrementItemQuantity', cartItem)
                }
                context.commit('decrementProductQuantity', product)
            }
        },
    },
    mutations: {
        pushProductToCart(state, productId) {
            state.cart.push({
                id: productId,
                quantity: 1
            })
        },
        incrementItemQuantity(state, cartItem) {
            cartItem.quantity++
        },
        decrementProductQuantity(state, product) {
            product.inventory--
        },
        
    },
}