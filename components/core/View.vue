<template>
	<v-main class="main-view">
		<div id="core-view" class="pa-5 pt-0">
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
