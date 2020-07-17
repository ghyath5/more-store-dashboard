<template>
	<div>
		<v-row justify="center">
			<v-col :key="card.text" v-for="card in cards">
				<data-counter @dataChanged="dataChanged" :card="card" />
			</v-col>
		</v-row>
		<nuxt-child />
	</div>
</template>
<script>
import dataCounter from '~/components/DataCounter';
import usersCountsSubGql from '~/gql/counts/users/subscription.gql';
import ordersCountsSubGql from '~/gql/counts/orders/subscription.gql';
import usersCountsQueryGql from '~/gql/counts/users/query.gql';
import ordersCountsQueryGql from '~/gql/counts/orders/query.gql';
export default {
	components: {
		dataCounter,
	},
	computed: {
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
					query: ordersCountsQueryGql,
					subscription: ordersCountsSubGql,
					gqlVars: {
						where: {
							options: {
								today_order: { _eq: true },
							},
						},
					},
					model: {
						name: 'orders',
					},
				},
				{
					id: 'active-clients',
					text: 'Active Clients',
					color: 'green',
					textColor: 'primary',
					subText: 'Now',
					to: '/activity/active-clients?active',
					sectionTitle: 'Clients Management',
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
									users_view: {
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
					id: 'non-active-clients',
					text: 'Non Active Clients',
					color: 'secondary',
					textColor: 'primary',
					subText: this.subTextNonActive,
					to: '/activity/active-clients?non-active',
					sectionTitle: 'Clients Management',
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
									users_view: {
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
	watch: {
		$route(val) {
			this.$store.commit('setPageDetails', {
				pageTitle: 'Activity',
			});
		},
	},
	data() {
		return {
			subTextNonActive: 0,
		};
	},
	created() {},
	methods: {
		dataChanged({ data, cardId }) {
			if (cardId === 'active-clients') {
				this.subTextNonActive = data;
			}
		},
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Activity',
		});
	},
};
</script>
