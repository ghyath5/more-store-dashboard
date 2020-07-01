<template>
	<v-app>
		<core-app-bar />
		<core-drawer />
		<core-view />
		<!-- <core-footer /> -->
		<v-snackbar
			v-if="snackActive"
			v-model="snackActive"
			:color="$store.state.snack.color"
			right
			top
			:timeout="$store.state.snack.timeout"
		>
			{{ $store.state.snack.text }}
		</v-snackbar>
	</v-app>
</template>

<script>
export default {
	middleware: 'isAuth',
	data: () => ({
		drawer: null,
	}),
	computed: {
		snackActive: {
			get() {
				return this.$store.state.snack.active;
			},
			set(value) {
				this.$store.commit('setSnack', { active: false });
			},
		},
	},
	components: {
		CoreDrawer: () => import('@/components/core/Drawer'),
		// CoreFooter: () => import('@/components/core/Footer'),
		CoreAppBar: () => import('@/components/core/AppBar'),
		CoreView: () => import('@/components/core/View'),
	},
};
</script>
<style>
.pointer {
	cursor: pointer;
}
</style>
