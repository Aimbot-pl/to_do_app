<template>
	<form @submit.prevent="createAccount">
		<div class="row g-3">
			<div class="col">
				<label class="form-label" for="first-name">First name</label>
				<input
					type="text"
					id="first-name"
					name="first-name"
                    v-model="firstName"
					class="form-control"
					aria-label="First name"
				/>
			</div>
			<div class="col">
				<label for="last-name" class="form-label">Last name</label>
				<input
					type="text"
					id="last-name"
					name="last-name"
                    v-model="lastName"
					class="form-control"
					aria-label="Last name"
				/>
			</div>
		</div>
		<div class="col-12">
			<label for="email" class="form-label mt-3">Email</label>
			<input type="email" name="email" v-model="email" id="email" class="form-control" />
		</div>
		<div class="col-12">
			<label for="password" class="form-label mt-3">Password</label>
			<input
				type="password"
				name="password"
                v-model="password"
				id="password"
				class="form-control"
			/>
		</div>
		<div class="col-12">
			<label for="password_confirmation" class="form-label mt-3"
				>Confirm password</label
			>
			<input
				type="password"
				name="password_confirmation"
                v-model="passwordConfirmation"
				id="password_confirmation"
				class="form-control"
			/>
		</div>
		<div class="row d-flex justify-content-around">
			<span class="form-label mt-3">Gender</span>
			<span class="col-5 border border-2 rounded-3 d-flex p-1">
				<label for="male" class="flex-grow-1">Male</label>
				<input type="radio" name="gender" v-model="gender" id="male" class="mt-1" />
			</span>
			<span class="col-5 border border-2 rounded-3 d-flex p-1">
				<label for="female" class="flex-grow-1">Female</label>
				<input type="radio" name="gender" v-model="gender" id="female" class="mt-1" />
			</span>
		</div>
        <div class="text-center mt-3">
            <input type="submit" class="btn btn-success" value="Create account" />
        </div>
	</form>
</template>

<script>
    export default {
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                gender: '',
            }
        },
        methods: {
            createAccount() {
                alert('Account has been created!')
            }
        }
    }
</script>
