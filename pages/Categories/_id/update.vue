<template>
	<v-container>
		<item-editor
			mode="update"
			:updateGql="updateGql"
			:headers="$store.state.categoryHeaders.filter(e => !e.notEditable)"
			@itemUpdated="updated"
			:item="item"
		></item-editor>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
import categoryGql from '~/gql/categories/one.gql';
import updateGql from '~/gql/categories/update.gql';
export default {
	components: {
		ItemEditor,
	},
	async asyncData({ store, app, params, query, redirect }) {
		let response = await app.apolloProvider.defaultClient.query({
			query: categoryGql,
			variables: {
				id: params.id,
			},
		});
		if (!response || !response.data || !response.data.categories_by_pk) {
			redirect('/categories');
		}
		return {
			item: response.data.categories_by_pk,
		};
	},
	data() {
		return {
			updateGql,
			// categoriesGql,
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
	mounted(){
		this.$store.commit('setPageDetails',{
			pageTitle:'Categories Management'
		})
	}
};
</script>
