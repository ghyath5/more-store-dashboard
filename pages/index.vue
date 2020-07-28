<template>
	<div class="mt-1">
		<v-row justify="center">
			<v-col :key="card.text" v-for="card in cards">
				<data-counter :card="card">
					<template v-slot:card-content="{ card, data }">
						<span v-if="card.id === 'total-sale'">{{ $store.state.currency.text }} {{ 739482 | numeral('0,0') }}</span>
					</template>
				</data-counter>
			</v-col>
		</v-row>
		<div class="pa-4 mt-4 elevation-2 white rounded-10">
			<h4 class="px-2 mb-8 font-weight-bold text-h4">Sales Details</h4>
			<chart
				:options="options"
				:chartdata="{
					labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
					datasets: [
						{
							backgroundColor: gradient,
							beginAtZero: false,
							data: [
								32,4,7,7,8,4,54,3,6,8,34,6,7,8,3,24,67,99,63,34,89,23,45,66,78,24,12,33,55,2,77,88,99,100,12,56,79,49,16,33,71,41,92
							],
							borderColor: '#4780fe',
							pointRadius: 3,
							pointHoverRadius: 5,
							pointBackgroundColor: '#4780fe',
						}
					],
				}"
			></chart>
		</div>
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
		options(){
			return {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false,
				},
				tooltips:{
					enabled: true,
					 custom: function(tooltip) {
						if (!tooltip) return;
						// disable displaying the color box;
						tooltip.displayColors = false;
					},
					callbacks: {						
						label: ((tooltipItems, data) => {
							console.log(tooltipItems)
							return tooltipItems
						})
					},
					title: function(tooltipItem, data) {
						return;
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								padding:20,
								max:100,
								stepSize: 20,
								callback: value => (value + '%'),
							},
							gridLines: {
								drawBorder: false,
								color:'rgb(211 212 215)',
								lineWidth:0.5
							},
							stacked: true
						},
					],
					xAxes: [
						{
							gridLines: {
								drawBorder: false,
								display: false,
							},
						},
					],
				},
				elements: {
					line: {
						tension: 0.1,
						borderWidth:1.5
					},
					point:{
						pointStyle:'point'
					}
				},
			}
		},
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
		gradient(){
			const ctx = document.createElement('canvas').getContext("2d")
			const gradient = ctx.createLinearGradient(0, 0, 0, 450);
			gradient.addColorStop(0, 'rgb(71,128,254,0.5)');   
			gradient.addColorStop(1, 'rgb(71,128,254,0)');
			return gradient
		}
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
