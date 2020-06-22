<template>
	<div>Create Categories</div>
</template>
<script>
export default {
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('create_categories')) {
			return redirect('/');
		}
	},
};
</script>
