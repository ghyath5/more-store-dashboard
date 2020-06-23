<template>
	<v-container>
		<v-data-table
			fixed-header
			:loading="Boolean(loading)"
			:headers="headers"
			:items="permissions"
			:server-items-length="permissionsCount"
			:items-per-page.sync="queryVariables.itemPerPage"
			:page.sync="queryVariables.page"
			ref="permissions-table"
			group-by="permission_group_name"
			sort-by="name"
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
								:readonly="column.value === 'admin'"
								:color="column.value === 'admin' ? 'success' : ''"
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
import rolesGql from '~/gql/roles/all.gql';
import associatePermissionsGql from '~/gql/roles/associatePermissionsWithRole.gql';
import permissionGql from '~/gql/roles/permissions.gql';
import deletePermissionGql from '~/gql/roles/delete_roles_permissions.gql';
export default {
	middleware({ store, redirect, app }) {
		if (!app.$has_permission('manage_roles')) {
			return redirect('/');
		}
	},
	methods: {
		getPermissions() {
			let variables = {
				limit: this.queryVariables.itemPerPage,
				offset: (this.queryVariables.page - 1) * this.queryVariables.itemPerPage,
			};
			this.$apollo.queries.allPermissions.refetch(variables);
		},
		setRolePermission(permission, role_name, checked) {
			if (checked) {
				this.$apollo.mutate({
					mutation: associatePermissionsGql,
					variables: {
						objects: {
							permission,
							role_name,
						},
						on_conflict: {
							constraint: 'roles_permissions_role_name_permission_key',
							update_columns: ['permission', 'role_name'],
						},
					},
				});
				return;
			}
			this.$apollo
				.mutate({
					mutation: deletePermissionGql,
					variables: {
						where: {
							_and: [{ permission: { _eq: permission } }, { role_name: { _eq: role_name } }],
						},
					},
				})
				.catch(e => {
					console.log(e);

					this.$store.commit('setSnack', {
						active: true,
						color: 'error',
					});
				});
		},
	},
	watch: {
		queryVariables: {
			handler() {
				this.getPermissions();
				let table = this.$refs['permissions-table'];
				let wrapper = table.$el.querySelector('div.v-data-table__wrapper');

				this.$vuetify.goTo(table); // to table
				this.$vuetify.goTo(table, { container: wrapper }); // to header
			},
			deep: true,
		},
	},
	data() {
		return {
			queryVariables: {
				itemPerPage: 10,
				page: 1,
			},
			changed: false,
			loading: 0,
			headers: [],
			permissions: [],
			permissionsCount: 0,
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
			variables() {
				return {
					limit: 10,
					offset: 0,
				};
			},
			update(data) {
				return data;
			},
			result({ data, loading, networkStatus }) {
				this.permissions = data.permissions;
				this.permissionsCount = data.permissions_aggregate.aggregate.count;
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		},
	},
};
</script>
