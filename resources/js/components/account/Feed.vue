<template>
	<h1>Hello </h1>
	<router-link :to="{ name: 'settings' }">Go to preferences</router-link>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "Feed",
};
</script>