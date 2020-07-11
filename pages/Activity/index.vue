<template>
	<v-container>
		<div style="clear:both"></div>
		<v-row justify="space-around">
			<v-col cols="12" sm="6" lg="3" :key="card.text" v-for="card in cards">
				<data-counter :card="card" />
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import dataCounter from '~/components/DataCounter';
import usersCountsSubGql from '~/gql/counts/users/subscription.gql';
import usersCountsQueryGql from '~/gql/counts/users/query.gql';
export default {
	components: {
		dataCounter,
	},
	computed: {
		overviewData() {
			let data = [
				{
					title: 'Total Clients',
					value: this.clients && this.clients.count,
				},
				{
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
		cards() {
			return [
				{
					text: 'Total Sale',
					color: 'primary',
					textColor: 'green',
					subText: '',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {},
					model: {
						name: '',
					},
				},
				{
					text: 'Today Orders',
					subText: '',
					color: 'blue',
					textColor: 'yellow',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {},
					model: {
						name: 'orders',
					},
				},
				{
					text: 'Active Clients',
					color: 'green',
					textColor: 'primary',
					subText: 'Now',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {
						where: {
							_and: [
								{
									roles: {
										role_name: { _eq: 'client' },
									},
								},
								{
									online_users: {
										online: { _eq: true },
									},
								},
							],
						},
					},
					model: {
						name: 'users',
					},
				},
				{
					text: 'Non Active Clients',
					color: 'secondary',
					textColor: 'primary',
					subText: '',
					query: usersCountsQueryGql,
					subscription: usersCountsSubGql,
					gqlVars: {
						where: {
							_and: [
								{
									roles: {
										role_name: { _eq: 'client' },
									},
								},
								{
									online_users: {
										online: { _neq: true },
									},
								},
							],
						},
					},
					model: {
						name: 'users',
					},
				},
			];
		},
	},
	data() {
		return {};
	},
	created() {},
	methods: {},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Activity',
		});
	},
};
</script>
