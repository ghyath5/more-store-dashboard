<template>
	<v-container>
		<item-editor
			:createGql="createGql"
			:headers="$store.state.roleHeaders.filter(e => !e.notEditable)"
			@itemCreated="created"
		></item-editor>
	</v-container>
</template>
<script>
import ItemEditor from '~/components/ItemEditor';
// import categoriesGql from '~/gql/categories/all.gql';
import createGql from '~/gql/roles/create.gql';
export default {
	components: {
		ItemEditor,
	},
	data() {
		return {
			createGql,
		};
	},
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('manage_roles')) {
			return redirect('/');
		}
	},
	methods: {
		created(data) {
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Roles created successfully!',
			});
			this.$router.push('/settings/roles');
		},
	},
};
</script>
