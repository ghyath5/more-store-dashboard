<template>
	<v-container>
		<data-table
			:headers="$store.state.roleHeaders"
			:queryGql="rolesGql"
			:deleteGql="deleteGql"
			:model="{
				name: 'roles',
				permission: 'roles',
				aggregate: 'roles_aggregate',
			}"
			defaultSortBy="created_at"
		>
			<template v-slot:createBtn>
				<v-btn class="mb-2" @click="$router.push(`/settings/roles/create`)" small color="info">Create</v-btn>
			</template>
		</data-table>
	</v-container>
</template>
<script>
import rolesGql from '~/gql/roles/all.gql';
import deleteGql from '~/gql/roles/delete.gql';
export default {
	data() {
		return {
			rolesGql,
			deleteGql,
		};
	},
	methods: {
		// rolesName(roles){
		//     return roles.map(one=>one.role)
		// }
	},
};
</script>
