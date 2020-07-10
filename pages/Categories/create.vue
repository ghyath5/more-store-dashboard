<template>
	<v-container fluid>
		<item-editor
			:createGql="createGql"
			:headers="$store.state.categoryHeaders.filter(e => !e.notEditable)"
			@itemCreated="created"
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
		if (!store.state.permissions.includes('create_categories')) {
			return redirect('/');
		}
	},
	methods: {
		created(data) {
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Category created successfully!',
			});
			this.$router.push('/categories');
		},
	},
	mounted(){
		this.$store.commit('setPageDetails',{
			pageTitle:'Create Category'
		})
	}
};
</script>
