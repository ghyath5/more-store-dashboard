<template>
	<v-main class="main-view">
		<div id="core-view" class="pa-5 pt-0">
			<h3 class="text-h3 primary--text pt-2 pb-4 pl-3 float-left" v-if="$store.state.pageDetails.pageTitle">{{ $store.state.pageDetails.pageTitle }}</h3>
			<v-fade-transition mode="out-in">
				<nuxt></nuxt>
			</v-fade-transition>
		</div>
	</v-main>
</template>

<script>
export default {
	name: 'CoreView',

	metaInfo() {
		return {
			title: 'Vue Material Dashboard by CreativeTim',
		};
	},
};
</script>
<style>
/* .main-view{
		background:#f4f6f9;
	} */
</style>
