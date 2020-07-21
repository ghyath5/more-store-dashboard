<template>
	<div class="mt-1">
		<v-row justify="center">
			<v-col :key="card.text" v-for="card in cards">
				<data-counter :card="card">
					<template v-slot:card-content="{ card, data }">
						<span v-if="card.id === 'total-sale'">{{ $store.state.currency.text }} 644,000</span>
					</template>
				</data-counter>
			</v-col>
		</v-row>
		<chart
			class="white rounded-10 elevation-4 mt-6"
			:options="{
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: {
						left: 20,
						right: 20,
						top: 40,
						bottom: 0,
					},
				},
				legend: {
					display: false,
				},
				scales: {
					yAxes: [
						{
							ticks: {
								stepSize: 10,
								callback: value => value + 'K',
							},
							gridLines: {
								drawBorder: false,
							},
						},
					],
					xAxes: [
						{
							ticks: {
								stepSize: 10323,
							},
							gridLines: {
								display: false,
							},
						},
					],
				},
			}"
			:chartdata="{
				labels: [2, 4, 8, 4, 5, 6, 7, 9, 9435, 42, 34],
				datasets: [
					{
						beginAtZero: false,
						data: [2, 4, 8, 4, 5, 6, 7, 9, 95, 42, 34],
						fill: false,
						borderColor: '#4780fe',
						pointRadius: 3,
						pointHoverRadius: 3,
						pointBackgroundColor: '#4780fe',
						lineTension: 0,
						spanGaps: true,
						order: 3,
					},
				],
			}"
		></chart>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import dataCounter from '~/components/DataCounter';

import usersCountsSubGql from '~/gql/counts/users/subscription.gql';
import usersCountsQueryGql from '~/gql/counts/users/query.gql';

import ordersCountsSubGql from '~/gql/counts/orders/subscription.gql';
import ordersCountsQueryGql from '~/gql/counts/orders/query.gql';

import chart from '~/components/material/chart.vue';
export default {
	components: {
		dataCounter,
		chart,
	},
	data() {
		return {};
	},
	computed: {
		cards() {
			return [
				{
					text: 'Total Clients',
					color: 'white',
					textColor: 'black',
					titleColor: 'grey',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {},
					model: {
						name: 'users',
					},
				},
				{
					text: 'Total Orders',
					color: 'white',
					textColor: 'black',
					titleColor: 'grey',
					query: ordersCountsQueryGql,
					subscription: ordersCountsSubGql,
					gqlVars: {},
					model: {
						name: 'orders',
					},
				},
				{
					id: 'total-sale',
					text: 'Total Sales',
					color: 'white',
					textColor: 'black',
					titleColor: 'grey',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {},
					model: {
						name: 'users',
					},
				},
				{
					text: 'Total Pending',
					color: 'white',
					textColor: 'black',
					titleColor: 'grey',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {},
					model: {
						name: 'users',
					},
				},
			];
		},
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
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Dashboard',
		});
	},
};
</script>

<style scoped>
.overview-card {
	border-radius: 10px;
	box-shadow: 2px 2px 5px 2px #eceef1 !important;
}
</style>
