<template>
	<v-main class="main-view">
		<v-container class="px-10">
			<h3
				class="text-xl-h3 text-md-h5 text-lg-4 font-weight-bold primary--text pt-2 pb-0"
				v-if="$store.state.pageDetails.pageTitle"
			>
				{{ $store.state.pageDetails.pageTitle }}
				<template v-for="(path, i) in $store.state.pageDetails.path">
					<span :key="i + 'slash'">/</span>
					<span :key="i + 1" :class="path.color">{{ path.name }}</span>
				</template>
			</h3>
			<!-- <div style="clear:both"></div> -->
			<v-fade-transition mode="out-in">
				<nuxt></nuxt>
			</v-fade-transition>
		</v-container>
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
