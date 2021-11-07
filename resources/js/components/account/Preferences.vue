<template>
	<div class="border border-2 rounded-2">
		<div class="row">
			<div class="col border-end border-2">
				<div class="d-flex flex-column flex-shrink-0 p-3">
					<a class="d-flex m-auto link-dark text-decoration-none">
						<span class="fs-4">Actions</span>
					</a>
					<hr />
					<ul class="nav nav-pills flex-column mb-auto">
						<li class="nav-item">
							<router-link
								:to="{
									name: 'changeData',
									params: { user: $route.params.user },
								}"
								class="nav-link text-center text-md-left"
							>
								Change personal data
							</router-link>
						</li>
						<li class="nav-item">
							<router-link
								:to="{
									name: 'changePassword',
									params: { user: $route.params.user },
								}"
								class="nav-link text-center text-md-left"
							>
								Change password
							</router-link>
						</li>
						<li class="nav-item">
							<router-link
								:to="{
									name: 'deleteAccount',
									params: { user: $route.params.user },
								}"
								class="nav-link text-center text-md-left"
							>
								Delete account
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="col-sm-8">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

