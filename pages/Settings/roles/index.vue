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
				pk: 'name',
			}"
			defaultSortBy="place"
		>
			<template v-slot:createBtn>
				<v-btn class="mb-2" @click="$router.push(`/settings/roles/create`)" small color="info">Create</v-btn>
			</template>
			<template v-slot:edit-btn="{ item }">
				<div v-if="['client', 'admin', 'driver'].includes(item.name)"></div>
			</template>
			<template v-slot:delete-btn="{ item }">
				<div v-if="['client', 'admin', 'driver'].includes(item.name)"></div>
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
