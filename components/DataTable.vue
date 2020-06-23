<template>
	<div>
		<slot name="aboveTable">
			<slot name="createBtn" v-if="$has_permission(`create_${model.permission}`)">
				<v-btn class="mb-2" small color="info">Create</v-btn>
			</slot>
			<slot name="reloadBtn">
				<v-btn @click="fetchData" class="mb-2 float-right" small>
					Reload Data
					<v-icon small>mdi-refresh</v-icon>
				</v-btn>
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
			:loading="!!loading"
			:show-select="showSelect"
			item-key="name"
			:expanded.sync="expanded"
			class="elevation-1 customDataTable"
		>
			<template v-slot:expanded-item="props">
				<slot name="expanded-item" :props="props">
					<td :colspan="headers.length">
						<nested-data-table
							:parentData="{ model }"
							:headers="headers"
							:items="props.item[model.nestedDataKey]"
						/>
					</td>
				</slot>
			</template>
			<template v-slot:item="props">
				<tr>
					<td :key="column.id" v-for="column in props.headers">
						<slot :props="props" :column="column" name="table-field">
							<template v-if="column.viewer === 'text'">
								<span>{{ props.item[column.value] }}</span>
							</template>
							<template v-else-if="column.viewer === 'imageViewer'">
								<image-viewer v-model="props.item[column.value]" />
							</template>
							<template v-else-if="column.viewer === 'date'">
								<span>{{ $moment(props.item[column.value]).fromNow() }}</span>
							</template>
							<template v-else-if="column.viewer === 'actions'">
								<div class="d-flex">
									<v-icon
										v-if="$has_permission(`update_${model.permission}`)"
										class="pointer"
										:size="18"
									>
										mdi-square-edit-outline
									</v-icon>
									<v-icon
										v-if="$has_permission(`delete_${model.permission}`)"
										@click="deleteItem(props.item)"
										class="pointer"
										:size="18"
									>
										mdi-delete
									</v-icon>
								</div>
							</template>
							<template v-else-if="column.viewer === 'icon' && column.defaultIcon">
								<v-icon small>{{ column.defaultIcon }}</v-icon>
							</template>
						</slot>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>
</template>
<script>
import NestedDataTable from '~/components/NestedDataTable.vue';
export default {
	name: 'DataTable',
	components: {
		NestedDataTable,
	},
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
		initialWhere: {
			default() {
				return null;
			},
			type: Object,
		},
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
			expanded: [],
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
			fetchPolicy: 'network-only',
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
					where: this.initialWhere,
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
		deleteItem(item) {
			if (!this.$has_permission('delete_categories')) return;

			const mutationOptions = {
				mutation: this.deleteGql,
				variables: {
					id: item.id,
				},
				update: (store, { data }) => {
					try {
						const query = {
							query: this.queryGql,
							variables: {
								limit: 10,
								offset: 0,
								order_by: {
									updated_at: 'desc',
								},
								where: this.initialWhere,
							},
						};
						// Read the cache
						const storeData = store.readQuery(query);
						const index = storeData[this.model.name].findIndex(
							i => i.id === data['delete_' + this.model.name + '_by_pk'].id
						);
						if (index !== -1) {
							storeData[this.model.name].splice(index, 1);
						}
						store.writeQuery({ ...query, data: storeData });
					} catch (error) {
						console.error(error);
					}
				},
			};
			this.$apollo.mutate(mutationOptions);
		},
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
