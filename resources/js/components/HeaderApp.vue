<template>
    <div class="mb-3">

    <header class="text-center">
        <h1>
            Todo List
        </h1>
    </header>
    <div class="d-flex justify-content-between mb-3">
        <h3>
            Add new task
        </h3>
        <button @click="toggleForm" :class="[showForm ? 'btn-danger' : 'btn-success']" class="btn">{{ btnTitle() }}</button>
    </div>
    <Form v-if="showForm" @add-task="addTask"/>
    </div>

</template>

<script>
import Form from './Form.vue'

export default {
    name: 'HeaderApp',
    data() {
        return {
            showForm: false,
        }
    },
    components: {
        "Form": Form
    },
    methods: {
        toggleForm() {
            this.showForm = !this.showForm
        },
        btnTitle() {
            return this.showForm ? 'Close Form' : 'Show Form'
        },
        addTask(data) {
            this.$emit('add-task', data);
        }
    }
}
</script>

<style>

</style>