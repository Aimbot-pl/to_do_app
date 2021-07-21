<template>
	<form @submit.prevent="addTask" class="py-3 px-2 border rounded-2">
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
			<input
				type="submit"
				class="btn btn-outline-success"
				value="Add task"
			/>
		</div>
	</form>
</template>

<script>
export default {
	name: "Form",
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
			this.data = {
				name: "",
				when: "",
				reminder: false
			};
        }
    }
};
</script>

<style scoped>
form {
	background-color: rgb(204, 204, 204);
}
</style>