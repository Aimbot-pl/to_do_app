<template>
 <nav v-if="isNotHomePage" class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class="navbar-brand" :to="{name: 'home'}">Home</router-link>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{name: 'tasks'}"
                                >Tasks</router-link
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
	<div class="container">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'App',
    computed: {
        isNotHomePage() {
            return (this.$route.path !== '/') ? true : false
        }
    }
}
</script>