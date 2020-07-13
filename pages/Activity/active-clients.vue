<template>
	<div>
		<h3 class="text-lg-h5 text-md-h6 font-weight-bold primary--text pt-2 pb-0">
			{{ sectionTitle }}
		</h3>
		<data-table
			class="clients-table"
			:headers="$store.state.userHeaders"
			:queryGql="usersGql"
			:subscriptionGql="subscriptionGql"
			:model="{
				name: 'users',
				permission: 'users',
				aggregate: 'users_aggregate',
				searchKeys: ['mobile_number', 'name', 'email'],
			}"
			defaultSortBy="last_seen"
			:initialWhere="{
				_and: [
					{
						roles: {
							role_name: { _eq: 'client' },
						},
					},
					{
						online_users: {
							online: { _eq: $route.query && $route.query.hasOwnProperty('non-active') ? false : true },
						},
					},
				],
			}"
		>
			<template v-slot:createBtn>
				<span></span>
				<!-- <v-btn class="mb-2" @click="$router.push(`/settings/users/create`)" small color="info">Create</v-btn> -->
			</template>
			<template v-slot:table-field="{ props: { item }, column }">
				<template v-if="column.value === 'last_seen'">
					<span class="green--text" v-if="item && item.online_users && item.online_users.online">
						<v-icon size="12" color="green">fiber_manual_record</v-icon>
						Active
					</span>
					<span v-else>
						<v-tooltip top>
							<template v-slot:activator="{ on }">
								<span v-on="on">{{ $moment(item.last_seen).fromNow() }}</span>
							</template>
							<span>
								{{ $moment(item.last_seen).format('DD-MM-yyyy') }}
								-
								{{ $moment(item.last_seen).format('hh:mm A') }}
							</span>
						</v-tooltip>
					</span>
				</template>
			</template>
		</data-table>
	</div>
</template>
<script>
import usersGql from '~/gql/users/all.gql';
import subscriptionGql from '~/gql/users/subscription.gql';
// import deleteGql from '~/gql/users/delete.gql';
export default {
	head() {
		return {
			title: this.sectionTitle,
		};
	},
	data() {
		return {
			usersGql,
			subscriptionGql,
			// deleteGql,
		};
	},
	computed: {
		sectionTitle() {
			return 'Clients Management';
		},
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Activity',
		});
	},
	methods: {},
};
</script>
<style>
.clients-table .customDataTable:not(.child) > .v-data-table__wrapper {
	max-height: 330px !important;
}
</style>
