<template>
	<ul style="list-group p-3">
		<li
			v-for="task in tasks.data"
			:key="task.id"
			:class="[task.attributes.reminder ? 'remind' : '']"
			class="list-group-item"
		>
			<div v-if="toggleForm(task.id)">
				<update-task
					@update-task="updateTask"
					@close-form="closeForm"
					:task="task"
				></update-task>
			</div>

			<div v-else>
				<div
					@dblclick="dbClick(task)"
					class="d-flex justify-content-between"
				>
					<h3>{{ task.attributes.name }}</h3>
					<div>
						<button
							@click="showUpdateForm(task.id)"
							class="btn btn-outline-warning mx-2"
						>
							Update
						</button>
						<button
							@click="$emit('delete-task', task.id)"
							class="btn btn-outline-danger mx-2"
						>
							Delete
						</button>
					</div>
				</div>

				<h4>On {{ task.attributes.when }}</h4>
			</div>
		</li>
	</ul>
</template>

<script>
import UpdateTask from "./UpdateTask.vue";

export default {
	name: "Tasks",
	data() {
		return {
			isUpdating: false,
			updatingTask: null,
		};
	},
	components: {
		"update-task": UpdateTask,
	},
	props: {
		tasks: Object,
	},
	methods: {
		showUpdateForm(id) {
			this.isUpdating = true;
			this.updatingTask = id;
		},
		toggleForm(id) {
			return this.isUpdating && this.updatingTask === id ? true : false;
		},
		updateTask(data) {
			this.$emit("update-task", data);
			this.closeForm();
		},
		closeForm() {
			this.isUpdating = false;
			this.updatingTask = null;
		},
		dbClick(data) {
			const newData = {
				id: data.id,
				name: data.attributes.name,
				when: data.attributes.when,
				reminder: !data.attributes.reminder,
			};
			this.updateTask(newData);
		},
	},
};
</script>

<style scoped>
h3 {
	font-size: 1.5rem;
}

h4 {
	font-size: 0.75rem;
}
ul {
	margin: 0;
	padding: 0;
}
.remind {
	border-left: 3px solid green;
}
</style>