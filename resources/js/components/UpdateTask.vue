<template>
	<form @submit.prevent="$emit('update-task', data)">
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
				class="btn btn-outline-success mx-2"
				value="Update task"
			/>
            <button @click.prevent="$emit('close-form')" class="btn btn-outline-danger">Cancel</button>
		</div>
	</form>
</template>

<script>
export default {
	name: "UpdateTask",
	props: ["task"],
    data() {
        return {
            data: {
                id: this.task.id,
                name: this.task.attributes.name,
                when: this.task.attributes.when,
                reminder: !!this.task.attributes.reminder,
            }
        }
    }
};
</script>

<style>
</style>