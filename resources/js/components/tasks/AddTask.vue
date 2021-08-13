<template>
	<form @submit.prevent="addTask" @reset="resetForm" class="py-3 px-2 border rounded-2">
		<h3 class="error" v-if="errors.message && !isTaskCreated">{{ errors.message }} </h3>
		<h3 v-else-if="isTaskCreated">{{ taskCreated }} </h3>
		<div class="mb-3 px-2">
			<div class="d-flex justify-content-between">
				<input
					type="text"
					v-model="data.name"
					id="name"
					placeholder="Name"
				/>
				<input type="date" v-model="data.when" id="when" />
				<div class="form-check">
					<input
						type="checkbox"
						v-model="data.reminder"
						name="reminder"
						id="reminder"
						class="form-check-input"
					/>
					<label for="reminder" class="form-check-label">Remind</label>
				</div>
			</div>
		</div>
		<div class="text-center">
			<div v-if="errors.errors && !isTaskCreated">
				<div v-for="field in errors.errors" :key="field">
					<div v-for="err in field" :key="err">
						<div class="invalid-feedback d-block">
							{{ err }}
						</div>
					</div>
				</div>
			</div>
			<div class="mt-3">
				<input
					type="submit"
					class="btn btn-outline-success mx-2"
					value="Add task"
				/>
				<input
					type="reset"
					class="btn btn-outline-danger mx-2"
					value="Reset form"
				/>
			</div>
		</div>
	</form>
</template>

<script>
export default {
	name: "AddTask",
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
            data: {
                name: "",
			    when: "",
			    reminder: false,
            }
		};
	},
    methods: {
        addTask() {
            this.$emit('add-task', this.data);
        },
		resetForm() {
			this.data = {
				name: "",
				when: "",
				reminder: false
			};
			this.$emit('flash-form');
		}
    },
	computed: {
		taskCreated() {
			this.$emit('flash-form');
			return 'Task has been created';
		}
	},
};
</script>

<style scoped>
form {
	background-color: rgb(204, 204, 204);
}
</style>