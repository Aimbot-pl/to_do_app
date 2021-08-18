<template>
    <ul v-if="products">
        <h1>Products</h1>
        <li v-for="product in products" :key="product.id" >
            {{ product.title }} - {{ product.price }} - {{ product.inventory }}
            <button v-if="product.inventory" @click="addProductToCart(product)">add to cart</button> 
            <button v-else disabled>out of stock</button>
        </li>
    </ul>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        computed: {
            ...mapState({
                products: state => state.products
            }),
        },
        methods: {
            ...mapActions(['addProductToCart']),
            isDisabled(product) {
                return product.inventory === 0 ? true : false
            }
        }
    }
</script>