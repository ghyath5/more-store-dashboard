<template>
	<div>
		<slot name="aboveTable">
			<slot name="createBtn">
				<v-btn small color="info">Create</v-btn>
			</slot>
		</slot>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:single-select="singleSelect"
			:server-items-length="itemsCount"
			:sort-by.sync="queryVariables.sortBy"
			:sort-desc.sync="queryVariables.sortDesc"
			:items-per-page.sync="queryVariables.itemPerPage"
			:page.sync="queryVariables.page"
			:items="items"
			:loading="Boolean(loading)"
			:show-select="showSelect"
			class="elevation-1 customDataTable"
		>
			<template v-slot:item="{ item, headers }">
				<tr>
					<td :key="column.id" v-for="column in headers">
						<slot name="tableField"></slot>
						<template v-if="column.viewer === 'text'">
							<span>{{ item[column.value] }}</span>
						</template>
						<template v-else-if="column.viewer === 'imageViewer'">
							<image-viewer v-model="item[column.value]" />
						</template>
						<template v-else-if="column.viewer === 'date'">
							<span>{{ $moment(item[column.value]).fromNow() }}</span>
						</template>
						<template v-else-if="column.viewer === 'actions'">
							<div></div>
						</template>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>
</template>
<script>
export default {
	name: 'DataTable',
	computed: {
		sortDirection() {
			if (Array.isArray(this.queryVariables.sortDesc)) {
				return this.queryVariables.sortDesc[0] ? 'desc' : 'asc';
			}
			return this.queryVariables.sortDesc ? 'desc' : 'asc';
		},
		sortBy() {
			if (Array.isArray(this.queryVariables.sortBy)) {
				return this.queryVariables.sortBy[0] ? this.queryVariables.sortBy[0] : 'updated_at';
			}
			return this.queryVariables.sortBy ? this.queryVariables.sortBy : 'updated_at';
		},
	},
	props: {
		model: {
			required: true,
			default() {
				return null;
			},
			type: Object,
		},
		queryGql: {
			type: Object,
			default() {
				return null;
			},
		},
		createGql: {
			type: Object,
			default() {
				return null;
			},
		},
		updateGql: {
			type: Object,
			default() {
				return null;
			},
		},
		deleteGql: {
			type: Object,
			default() {
				return null;
			},
		},
		singleSelect: {
			type: Boolean,
			default() {
				return false;
			},
		},
		showSelect: {
			type: Boolean,
			default() {
				return false;
			},
		},
		headers: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	watch: {
		queryVariables: {
			handler() {
				this.fetchData();
			},
			deep: true,
		},
	},
	data() {
		return {
			queryVariables: {
				sortBy: 'updated_at',
				sortDesc: true,
				itemPerPage: 10,
				page: 1,
			},
			selected: [],
			loading: 0,
			items: [],
			itemsCount: null,
		};
	},
	apollo: {
		// Advanced query with parameters
		// The 'variables' method is watched by vue
		items: {
			query() {
				return this.queryGql;
			},
			// Reactive parameters
			variables() {
				// Use vue reactive properties here
				return {
					limit: 10,
					offset: 0,
					order_by: {
						updated_at: 'desc',
					},
				};
			},
			// Variables: deep object watch
			deep: true,
			// We use a custom update callback because
			// the field names don't match
			// By default, the 'pingMessage' attribute
			// would be used on the 'data' result object
			// Here we know the result is in the 'ping' attribute
			// considering the way the apollo server works
			update(data) {},
			// Optional result hook
			result({ data, loading, networkStatus }) {
				let items = data[this.model.name];
				let aggregate = data[this.model.aggregate].aggregate;
				this.items = items;
				this.itemsCount = aggregate.count;
				// console.log('We got some result!')
			},
			// Error handling
			error(error) {
				console.error("We've got an error!", error);
			},
			// Loading state
			// loadingKey is the name of the data property
			// that will be incremented when the query is loading
			// and decremented when it no longer is.
			loadingKey: 'loading',
			// watchLoading will be called whenever the loading state changes
			watchLoading(isLoading, countModifier) {
				// isLoading is a boolean
				// countModifier is either 1 or -1
			},
		},
	},
	methods: {
		fetchData() {
			let variables = {
				order_by: {
					[this.sortBy]: this.sortDirection,
				},
				limit: this.queryVariables.itemPerPage,
				offset: (this.queryVariables.page - 1) * this.queryVariables.itemPerPage,
			};
			this.$apollo.queries.items.refetch(variables);
		},
	},
};
</script>
<style>
/* .customDataTable table thead tr th {
    min-width: 100px !important;
  } */
</style>
