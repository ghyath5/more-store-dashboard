<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col v-for="(info, i) in overviewData" :key="i" cols="12" sm="6" lg="3">
				<v-card height="130" flat class="overview-card">
					<v-card-text>
						<div class="text-left">
							<p class="grey--textd font-weight-light mb-5" v-text="info.title" />
							<h3 class="headline font-weight text--primary">
								{{ info.value }}
							</h3>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
			<!-- <v-col cols="12" lg="10">
				<material-card color="light-blue" title="Orders" text="Real-time overview">
					<v-data-table :headers="headers" :items="items" hide-default-footer />
				</material-card>
			</v-col> -->
		</v-row>
	</v-container>
</template>

<script>
import gql from 'graphql-tag';
export default {
	data() {
		return {
			headers: [
				{
					sortable: false,
					text: 'Track ID',
					value: 'id',
				},
				{
					sortable: false,
					text: 'Driver Name',
					value: 'name',
				},
				{
					sortable: false,
					text: 'Order cost',
					value: 'salary',
					align: 'right',
				},
				{
					sortable: false,
					text: 'Address',
					value: 'country',
					align: 'right',
				},
				{
					sortable: false,
					text: 'City',
					value: 'city',
					align: 'right',
				},
			],
			items: [
				{
					id: '4431689d-4d0e-45e1-be12-e3a34ce1d352',
					name: 'Minerva Hooper',
					country: 'Curaçao',
					city: 'Sinaai-Waas',
					salary: '$23,738',
				},
				{
					id: '77316897-4d0e-45e1-b522-e3a34ce1d6f6',
					name: 'Sage Rodriguez',
					country: 'Netherlands',
					city: 'Overland Park',
					salary: '$56,142',
				},
			],
		};
	},
	computed: {
		overviewData() {
			let data = [
				this.$has_permission('read_users') && {
					title: 'Total Clients',
					value: this.clients && this.clients.count,
				},
				this.$has_permission('read_orders') && {
					title: 'Total Orders',
					value: '23',
				},
				{
					title: 'Total Sales',
					value: this.products && this.products.count,
				},
				{
					title: 'Total Pending',
					value: '23',
				},
			];
			return data.filter(e => e);
		},
	},
	apollo: {
		clients: {
			query: gql`
				query clients($where: users_bool_exp) {
					users_aggregate(where: $where) {
						aggregate {
							count
						}
					}
				}
			`,
			fetchPolicy: 'network-only',
			variables() {
				return {
					where: {
						roles: {
							role_name: { _eq: 'client' },
						},
					},
				};
			},
			update(data) {
				return data.users_aggregate.aggregate;
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		},
		products: {
			query: gql`
				query products {
					products_aggregate {
						aggregate {
							count
						}
					}
				}
			`,
			variables() {
				return {};
			},
			update(data) {
				console.log(data.products_aggregate);

				return data.products_aggregate.aggregate;
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		},
	},
	methods: {},
};
</script>

<style scoped>
.overview-card {
	border-radius: 10px;
	box-shadow: 2px 2px 5px 2px #eceef1 !important;
}
</style>
