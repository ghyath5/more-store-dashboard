<template>
	<v-app>
		<core-app-bar />
		<core-drawer />
		<core-view />
		<!-- <core-footer /> -->
		<v-snackbar
			v-model="$store.state.snack.active"
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
