<template>
	<v-container>
		<v-btn @click="associate" :disabled="!changed" class="mb-2" small color="success">Save changes</v-btn>
		<v-data-table
			fixed-header
			:loading="Boolean(loading)"
			:headers="headers"
			:items="permissions"
			group-by="permission_group_name"
			height="410"
		>
			<template v-slot:group.header="{ group }">
				<td class="text-capitalize blue lighten-1 white--text" :colspan="headers.length">
					{{ group }}
				</td>
			</template>
			<template v-slot:item="{ item, headers }">
				<tr>
					<td :key="column.id" v-for="column of headers">
						<template v-if="column.value === 'name'">
							{{ item[column.value] }}
							<span>{{ item.description }}</span>
						</template>
						<template v-else>
							<v-checkbox
								@change="setRolePermission(item.name, column.value, $event)"
								:input-value="column.permissions.includes(item.name)"
								class="mx-2"
							></v-checkbox>
						</template>
					</td>
				</tr>
			</template>
		</v-data-table>
	</v-container>
</template>
<script>
import rolesGql from '~/graphql/roles/all.gql';
import associatePermissionsGql from '~/graphql/roles/associatePermissionsWithRole.gql';
import permissionGql from '~/graphql/permissions.gql';
export default {
	middleware({ store, redirect }) {
		if (!store.state.permissions.includes('manage_roles')) {
			return redirect('/');
		}
	},
	methods: {
		associate() {
			let roles = this.headers.filter(header => header.id !== 1);
			let objects = [];
			let permissions = [];
			roles.map(role => {
				permissions.push(...role.permissions);
				role.permissions.map(permission => {
					objects.push({
						permission,
						role_name: role.value,
					});
				});
			});
			// console.log(permissions);

			this.$apollo.mutate({
				mutation: associatePermissionsGql,
				variables: {
					objects,
					on_conflict: {
						constraint: 'roles_permissions_role_name_permission_key',
						update_columns: ['permission', 'role_name'],
					},
				},
			});
		},
		setRolePermission(permission, column, checked) {
			let role = this.headers.find(col => col.value === column);
			let permissions = role.permissions;
			if (checked) {
				permissions.push(permission);
			} else {
				permissions = permissions.filter(p => p !== permission);
			}
			role.permissions = permissions;
			console.log(role, role.permissions);

			this.changed = true;
		},
	},
	data() {
		return {
			changed: false,
			loading: 0,
			headers: [],
			permissions: [],
			roles_permissions: {},
		};
	},
	apollo: {
		allRoles: {
			query: rolesGql,
			variables() {
				return {
					order_by: {
						id: 'asc',
					},
				};
			},
			update(data) {
				// return data
			},
			result({ data, loading, networkStatus }) {
				this.headers = [
					{
						id: 1,
						text: 'Permissions',
						value: 'name',
						width: 200,
						sortable: false,
					},
				];
				let roles = data.roles;
				roles.map((role, i) => {
					this.headers.push({
						id: (i + 1) * 50,
						text: role.name,
						value: role.name,
						sortable: false,
						permissions: role.permissions.map(p => p.permission),
					});
				});
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		},
		allPermissions: {
			query: permissionGql,
			// variables() {
			// 	return {
			// 		limit: 10,
			// 		offset: 0,
			// 	};
			// },
			update(data) {
				return data;
			},
			result({ data, loading, networkStatus }) {
				this.permissions = data.permissions;
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		},
	},
};
</script>
