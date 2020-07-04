<template>
	<v-container fluid>
		<data-table
			:headers="$store.state.orderHeaders"
			:queryGql="ordersGql"
			:deleteGql="deleteGql"
			:model="{
				name: 'orders',
				permission: 'orders',
				aggregate: 'orders_aggregate',
				searchKey: 'status',
			}"
		>
			<template v-slot:table-field="{ props, column }">
				<div v-if="column.value === 'driver'">
					<template v-if="$has_permission('assign_drivers')">
						<span v-if="props.item[column.value]">
							{{ props.item[column.value].name }}
						</span>
						<span v-else>
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn @click="openDriversTable(props.item)" v-on="on" icon x-small color="primary">
										<v-icon>mdi-link-plus</v-icon>
									</v-btn>
								</template>
								<span>Assign driver</span>
							</v-tooltip>
						</span>
					</template>
					<template v-else>
						Not allowed to see this
					</template>
				</div>
			</template>
		</data-table>
		<v-dialog v-model="driversDialog.active" max-width="800" v-if="driversDialog.active">
			<v-card>
				<v-card-title>Assign a driver</v-card-title>
				<v-card-text>
					<data-table
						:headers="driverColumns"
						:queryGql="usersGql"
						:model="{
							name: 'users',
							permission: 'users',
							aggregate: 'users_aggregate',
						}"
						:initialWhere="{
							roles: {
								role_name: {
									_eq: 'driver',
								},
							},
						}"
						showSelect
						singleSelect
					>
						<template v-slot:createBtn>
							<div></div>
						</template>
						<template v-slot:table-field="{ props: { item }, column }">
							<template v-if="column.value === 'assigned_orders'">
								{{ item[column.value].length }}
							</template>
						</template>
					</data-table>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>
<script>
import ordersGql from '~/gql/orders/all.gql';
import usersGql from '~/gql/users/all.gql';
import deleteGql from '~/gql/orders/delete.gql';
export default {
	data() {
		return {
			usersGql,
			ordersGql,
			deleteGql,
			driversDialog: {
				active: false,
			},
		};
	},
	computed: {
		driverColumns() {
			let cols = this.$remove_headers(this.$store.state.userHeaders, ['email', 'roles', 'actions', 'updated_at']);
			const { length, [length - 1]: last } = cols;
			//
			cols.push({
				id: last.id + 20,
				text: 'Assigned Orders',
				value: 'assigned_orders',
				sortable: false,
			});
			return cols;
		},
	},
	methods: {
		openDriversTable(item) {
			console.log(item);
			this.driversDialog.active = true;
		},
	},
};
</script>
