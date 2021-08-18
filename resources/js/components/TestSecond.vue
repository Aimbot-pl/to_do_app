<template>
    <input type="text" v-model="session_text">
</template>
<script>
export default {
    data() {
        return {
            session_text: sessionStorage.getItem('session_text')
        }
    },
    watch: {
        session_text() {
            sessionStorage.setItem('session_text', this.session_text)
        }
    }
}    
</script>