<template>
	<h1>Shopping cart</h1>
	<ul v-if="products">
		<li v-for="product in products" :key="product.title">
			{{ product.title }} - {{ product.price }} - {{ product.quantity }}
		</li>
		<span v-if="total>0"> total: {{ total }} </span>
	</ul>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
	computed: {
		...mapGetters({
            products: 'cartProducts',
            total: 'total'
        }),
	},
	methods: {},
};
</script>