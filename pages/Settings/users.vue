<template>
	<v-container>
		<data-table
			:headers="$store.state.userHeaders"
			:queryGql="usersGql"
			:model="{
				name: 'users',
				permission: 'users',
				aggregate: 'users_aggregate',
			}"
		>
			<template v-slot:createBtn>
				<v-btn class="mb-2" @click="$router.push(`/settings/users/create`)" small color="info">Create</v-btn>
			</template>
			<template v-slot:table-field="{ props: { item }, column }">
				<template v-if="column.value === 'roles'">
					<div v-if="rolesName(item[column.value]).length">
						<v-chip
							outlined
							v-for="role of rolesName(item[column.value])"
							:key="role.name"
							class="ma-1"
							small
						>
							<span class="text-capitalize">{{ role.name }}</span>
						</v-chip>
					</div>
					<span class="secondary--text" v-else>No roles assigned</span>
				</template>
			</template>
		</data-table>
	</v-container>
</template>
<script>
import usersGql from '~/gql/users/all.gql';
// import deleteGql from '~/gql/users/delete.gql';
export default {
	data() {
		return {
			usersGql,
			// deleteGql,
		};
	},
	methods: {
		rolesName(roles) {
			return roles.map(one => one.role);
		},
	},
};
</script>
