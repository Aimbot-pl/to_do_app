<template>
    <div class="mx-auto col-12 col-sm-6 col-md-4">
        <LoginComp/>
    </div>
</template>

<script>
import LoginComp from '../components/account/Login.vue'
export default {
    name: 'Login',
    components: {
        LoginComp
    },
}
</script>