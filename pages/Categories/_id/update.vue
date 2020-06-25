<template>
	<v-container>
		<item-editor
			mode="update"
			:createGql="createGql"
			:headers="$store.state.categoryHeaders.filter(e => !e.notEditable)"
			@itemUpdated="updated"
		></item-editor>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
import categoriesGql from '~/gql/categories/all.gql';
import createGql from '~/gql/categories/create.gql';
export default {
	components: {
		ItemEditor,
	},
	data() {
		return {
			createGql,
			categoriesGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('update_categories')) {
			return redirect('/');
		}
	},
	methods: {
		updated(data) {
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Category saved successfully!',
			});
			this.$router.push('/categories');
		},
	},
};
</script>
