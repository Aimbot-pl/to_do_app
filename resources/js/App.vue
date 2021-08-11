<template>
	<div
		class="container my-3 p-3 col-sm-10 col-md-6 border border-2 rounded-2"
	>
		<header-app @add-task="addTask" @flash-form="flashForm" :errors="responseErrors" :isTaskCreated="isTaskCreated"></header-app>
		<div v-if="isLoaded">
			<Tasks
				@update-task="updateTask"
				@delete-task="deleteTask"
				:tasks="this.tasks"
			/>
			<nav>
				<ul class="pagination mt-3 justify-content-center">
					<li
						@click="loadTasks(this.tasks.links.prev)"
						:class="[this.tasks.links.prev ? '' : 'disabled']"
						class="page-item"
					>
						<a class="page-link"> &laquo; Previous </a>
					</li>
					<li class="page-item active">
						<a class="page-link">
							Page {{ this.tasks.meta.current_page }} of
							{{ this.tasks.meta.last_page }}
						</a>
					</li>
					<li
						@click="loadTasks(this.tasks.links.next)"
						:class="[this.tasks.links.next ? '' : 'disabled']"
						class="page-item"
					>
						<a class="page-link"> Next &raquo; </a>
					</li>
				</ul>
			</nav>
		</div>
		<h3 v-else>Loading...</h3>
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
			errors: [],
			isLoaded: false,
			status: null,
		};
	},
	created() {
		this.loadTasks();
	},
	methods: {
		async loadTasks(site = "/api/tasks") {
			if (site) {
				this.isLoaded = false;
				const res = await axios
					.get(site)
					.then((res) => {
						this.tasks = res.data;
						this.isLoaded = true;
					})
					.catch((err) => {
						this.errors = err;
					});
			}
		},
		async addTask(data) {
			const res = await axios
				.post("/api/tasks", {
					name: data.name,
					when: data.when,
					reminder: data.reminder,
				})
				.then((res) => {
					console.log(res);
					this.loadTasks();
					this.status = res.status;
				})
				.catch((err) => {
					console.log(err);
					this.errors = err;
				});
		},
		async deleteTask(id) {
			const res = await axios
				.delete("/api/tasks/" + id)
				.then((res) => {
					this.loadTasks();
				})
				.catch((err) => {
					this.status = err.status;
					this.errors = err;
				});
		},
		async updateTask(data) {
			const res = await axios
				.put("/api/tasks/" + data.id, {
					name: data.name,
					when: data.when,
					reminder: data.reminder,
				})
				.then((res) => {
					this.loadTasks();
				})
				.catch((err) => {
					this.errors = err;
				});
		},
		flashForm() {
			this.errors = [];
			this.status = null;
		}
	},
	computed: {
		responseErrors() {
			return this.errors.response ? this.errors.response.data : {};
		},
		isTaskCreated() {
			return (this.status === 201) ? true : false;
		}
	},
};
</script>

<style>
a:hover {
	cursor: pointer;
}
</style>