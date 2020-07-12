<template>
	<data-table
		:headers="$store.state.userHeaders"
		:queryGql="usersGql"
		:model="{
			name: 'users',
			permission: 'users',
			aggregate: 'users_aggregate',
			searchKeys: ['mobile_number', 'name', 'email'],
		}"
		defaultSortBy="last_seen"
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
</template>
<script>
import usersGql from '~/gql/users/all.gql';
// import deleteGql from '~/gql/users/delete.gql';
export default {
	head() {
		return {
			title: this.title,
		};
	},
	data() {
		return {
			usersGql,
			// deleteGql,
		};
	},
	computed: {
		title() {
			return 'Clients';
		},
	},
	methods: {
		rolesName(roles) {
			return roles.map(one => one.role);
		},
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: this.title,
		});
	},
};
</script>
