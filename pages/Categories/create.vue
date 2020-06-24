<template>
	<v-container>
		<item-editor :headers="$store.state.categoryHeaders.filter(e => !e.notEditable)"></item-editor>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
import categoriesGql from '~/gql/categories/all.gql';
export default {
	components: {
		ItemEditor,
	},
	data() {
		return {
			categoriesGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('create_categories')) {
			return redirect('/');
		}
	},
};
</script>
