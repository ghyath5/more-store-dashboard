<template>
	<div>
		<h3 class="text-xl-h3 mb-3 text-md-h5 text-lg-4 font-weight-bold primary--text pt-2 pb-0">
			{{ sectionTitle }}
		</h3>
		<data-table
			class="activity-tables"
			:headers="$store.state.orderHeaders"
			:queryGql="ordersGql"
			:deleteGql="deleteGql"
			:subscriptionGql="subscriptionGql"
			defaultSortBy="created_at"
			:model="{
				name: 'orders',
				permission: 'orders',
				aggregate: 'orders_aggregate',
				searchKeys: ['status', 'notes', 'assigned_driver.driver.name', 'client.name', 'way', 'track_id'],
			}"
			:initialWhere="ordersQueryWhere"
		>
			<template v-slot:above-table-content>
				<p class="mb-0 pa-0 grey--text float-left" v-if="status === 'delivered'">
					Note: Delivered orders can not be modified
				</p>
			</template>
			<template v-slot:table-field="{ props, column }">
				<!-- <div v-if="column.value === 'total_cost'">
					{{calculatedTotalPrice(props.item.selected_products,props.item.delivery_way)}} {{$store.state.currency.text}}
				</div> -->
				<div v-if="column.value === 'order_status'">
					<template v-if="selectStatus.active === props.item.id && updatable(props.item)">
						<div class="d-flex">
							<v-select
								:items="statuses"
								item-text="status"
								item-value="value"
								:value="props.item[column.value]"
								@change="
									selectStatus.status = $event.status;
									selectStatus.value = $event.value;
								"
								dense
								return-object
								solo
								hide-details
							></v-select>
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn
										:loading="selectStatus.loading"
										class="ma-1 d-block"
										@click="handleSaveStatus(props.item)"
										v-on="on"
										icon
										x-small
										color="blue"
									>
										<v-icon size="25">mdi-content-save-outline</v-icon>
									</v-btn>
								</template>
								<span>Save</span>
							</v-tooltip>
						</div>
					</template>
					<template v-else>
						<span>{{ props.item[column.value].status }}</span>
						<v-tooltip top v-if="updatable(props.item)">
							<template v-slot:activator="{ on }">
								<v-btn @click="changeStatus(props.item)" v-on="on" icon x-small color="blue">
									<v-icon>mdi-circle-edit-outline</v-icon>
								</v-btn>
							</template>
							<span>Change status</span>
						</v-tooltip>
					</template>
				</div>
				<div v-else-if="column.value === 'assigned_driver'">
					<template v-if="$has_permission('assign_drivers')">
						<div v-if="props.item[column.value]">
							<span>{{ props.item[column.value].driver.name }}</span>
							<v-tooltip top v-if="updatable(props.item)">
								<template v-slot:activator="{ on }">
									<v-btn @click="openDriversTable(props.item)" v-on="on" icon x-small color="blue">
										<v-icon>mdi-link-plus</v-icon>
									</v-btn>
								</template>
								<span>Replace driver</span>
							</v-tooltip>
						</div>
						<span v-else-if="updatable(props.item)">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn @click="openDriversTable(props.item)" v-on="on" icon x-small color="blue">
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
						v-model="selected"
						:headers="driverColumns"
						:queryGql="usersGql"
						:showTableBtns="false"
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
						<template v-slot:reload-btn>
							<div></div>
						</template>
						<template v-slot:table-field="{ props: { item }, column }">
							<template v-if="column.value === 'active_orders_assigned'">
								{{ item[column.value].length }}
							</template>
						</template>
					</data-table>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						:loading="driversDialog.loading"
						color="blue"
						class="white--text"
						:disabled="selected.length !== 1"
						@click="assignOrder"
					>
						Assign
						<v-icon>mdi-link-plus</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="statusConfirmingDialog.active" max-width="450" v-if="statusConfirmingDialog.active">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					Are you sure?
				</v-card-title>
				<v-card-text>
					<slot name="delete-dialog-content">
						Do you want to mark this order as completed ?
					</slot>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn
						color="primary"
						text
						@click="
							statusConfirmingDialog.active = false;
							selectStatus.active = false;
						"
					>
						No, cancel
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn
						color="error"
						text
						@click="
							saveStatus(statusConfirmingDialog.item);
							statusConfirmingDialog.active = false;
						"
					>
						Yes, mark as completed
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import ordersGql from '~/gql/orders/all.gql';
import statusesGql from '~/gql/orders/orderStatuses.gql';
import subscriptionGql from '~/gql/orders/subscription.gql';
import usersGql from '~/gql/users/all.gql';
import deleteGql from '~/gql/orders/delete.gql';
import updateOrderGql from '~/gql/orders/update.gql';
import assignDriverGql from '~/gql/orders/assignDriver.gql';
export default {
	data() {
		return {
			usersGql,
			ordersGql,
			deleteGql,
			subscriptionGql,
			driversDialog: {
				active: false,
				loading: false,
			},
			selected: [],
			statuses: [],
			selectStatus: {
				active: false,
				loading: false,
				status: 'Confirmed',
				value: 'confirmed',
			},
			statusConfirmingDialog: {
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
				text: 'Active assigned Orders',
				value: 'active_orders_assigned',
				sortable: false,
			});
			return cols;
		},
		status() {
			return this.$route.query && this.$route.query.status ? this.$route.query.status : '';
		},
		ordersQueryWhere() {
			let where = {
				options: {
					today_order: { _eq: true },
				},
			};

			return where;
		},
		sectionTitle() {
			return 'Orders Management';
		},
	},
	async created() {
		let { data } = await this.$apollo.query({ query: statusesGql });
		this.statuses = data.order_statuses;
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Activity',
		});
	},
	methods: {
		updatable(item) {
			return item.order_status.value !== 'completed';
		},
		handleSaveStatus(item) {
			if (this.selectStatus.value === 'completed') {
				this.statusConfirmingDialog.item = item;
				this.statusConfirmingDialog.active = true;
			} else {
				this.saveStatus(item);
			}
		},
		async saveStatus({ id }) {
			this.selectStatus.loading = true;
			await this.$apollo.mutate({
				mutation: updateOrderGql,
				variables: {
					pk_columns: {
						id,
					},
					_set: {
						status: this.selectStatus.status,
					},
				},
			});
			this.selectStatus = {
				active: false,
				loading: false,
				status: 'Confirmed',
				value: 'confirmed',
			};
		},
		changeStatus(item) {
			this.selectStatus.active = item.id;
		},
		openDriversTable(item) {
			// console.log(item);
			this.driversDialog.active = true;
			this.activeOrder = item;
		},
		async assignOrder() {
			this.driversDialog.loading = true;
			await this.$apollo.mutate({
				mutation: assignDriverGql,
				variables: {
					object: {
						driver_id: this.selected[0].id,
						order_id: this.activeOrder.id,
						status: 'created',
					},
					on_conflict: {
						constraint: 'assigned_drivers_order_id_key',
						update_columns: ['driver_id'],
					},
				},
				update(store, { data }) {
					console.log(store, data);
				},
			});
			this.driversDialog = {
				active: false,
				loading: false,
			};
		},
		// calculatedTotalPrice(products,{cost}){
		// 	return products.reduce((prev, curr)=>{
		// 		prev = prev + curr.calculated_quantity_times_cost
		// 		return prev
		// 	},0)+cost
		// }
	},
	head() {
		return {
			title: this.sectionTitle,
		};
	},
};
</script>
<style>
.v-select__selection {
	max-width: 95%;
}
.v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
	min-height: 29px;
}
</style>
