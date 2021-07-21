<template>
	<div
		class="container my-3 p-3 col-sm-10 col-md-6 border border-2 rounded-2"
	>
		<header-app @add-task="addTask"></header-app>
		<Tasks @update-task="updateTask" @delete-task="deleteTask" :tasks="this.tasks" />
	</div>
</template>

<script>
import HeaderApp from "./components/HeaderApp.vue";
import Tasks from "./components/Tasks.vue";

export default {
	name: "App",
	components: {
		"header-app": HeaderApp,
		Tasks,
	},
	data() {
		return {
			tasks: [],
		};
	},
    created() {
        this.loadTasks()
    },
	methods: {
		async loadTasks() {
            const res = await axios.get('/api/tasks')
                .then((res) => {
                    this.tasks = res.data.data;
                }).catch((error) => {
                    console.log(error)
                })
        },
        async addTask(data) {
			const res = await axios.post('/api/tasks', {
				name: data.name,
				when: data.when,
				reminder: data.reminder
			}).then((res) => {
				console.log(res);
				this.loadTasks();
			}).catch((err) => {
				console.log(err);
			})
        },
		async deleteTask(id) {
			const res = await axios.delete('/api/tasks/'+id)
				.then((res) => {
					this.tasks = res.data.data;
				}).catch((err) => {
					console.log(err);
				});
		},
		async updateTask(data) {
			const res = await axios.put('/api/tasks/'+data.id, {
				name: data.name,
				when: data.when,
				reminder: data.reminder
			})
			.then((res) => {
				console.log(res);
				this.loadTasks();
			}).catch((err) => {
				console.log(err);
			})
		}
	},
};
</script>

<style>
</style>