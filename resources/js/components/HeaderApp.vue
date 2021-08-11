<template>
	<div class="mb-3">
		<header class="text-center">
			<h1>Todo List</h1>
		</header>
		<div class="d-flex justify-content-between mb-3">
			<h3>Add new task</h3>
			<button
				@click="toggleForm"
				:class="[showForm ? 'btn-danger' : 'btn-success']"
				class="btn"
			>
				{{ btnTitle() }}
			</button>
		</div>
		<add-task
			v-if="showForm"
			@add-task="addTask"
            @flash-form="$emit('flash-form')"
			:errors="errors"
            :isTaskCreated="isTaskCreated"
		></add-task>
	</div>
</template>

<script>
import AddTask from "./AddTask.vue";

export default {
	name: "HeaderApp",
	props: {
		errors: {
			type: Object,
			required: false,
		},
		isTaskCreated: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			showForm: false,
		};
	},
	components: {
		"add-task": AddTask,
	},
	methods: {
		toggleForm() {
			this.showForm = !this.showForm;
            if (this.showForm === false) {
                this.$emit('flash-form');
            }
		},
		btnTitle() {
			return this.showForm ? "Close Form" : "Show Form";
		},
		addTask(data) {
			this.$emit("add-task", data);
		},
	},
};
</script>

<style>
</style>