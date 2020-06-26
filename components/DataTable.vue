<template>
	<div>
		<slot name="aboveTable">
			<slot name="createBtn" v-if="$has_permission(`create_${model.permission}`)">
				<v-btn class="mb-2" @click="$router.push(`/${model.name}/create`)" small color="info">Create</v-btn>
			</slot>
			<slot name="reloadBtn">
				<v-btn @click="fetchData" class="mb-2 float-right" small>
					Reload Data
					<v-icon small>mdi-refresh</v-icon>
				</v-btn>
			</slot>
		</slot>
		<v-data-table
			ref="dataTable"
			:dark="dark"
			fixed-header
			dense
			:hide-default-footer="hideFooter"
			:hide-default-header="hideHeader"
			v-model="selected"
			:headers="headers.filter(h => !h.notViewable)"
			:single-select="singleSelect"
			:server-items-length="itemsCount"
			:sort-by.sync="queryVariables.sortBy"
			:sort-desc.sync="queryVariables.sortDesc"
			:items-per-page.sync="itemPerPage"
			:page.sync="page"
			:items="items"
			:loading="!!loading"
			:show-select="showSelect"
			item-key="name"
			:expanded.sync="expanded"
			:height="height"
			class="elevation-1 customDataTable"
		>
			<template v-slot:expanded-item="props">
				<td class="pt-1 pb-2" style="z-index:1;position:relative" :colspan="headers.length">
					<data-table
						class="ml-6"
						:headers="headers"
						:queryGql="queryGql"
						:deleteGql="deleteGql"
						:initialWhere="{
							parent_id: { _eq: props.item.id },
						}"
						:height="null"
						dark
						:hideFooter="props.item[model.nestedDataKey].length <= itemPerPage"
						:model="model"
					>
						<template v-slot:aboveTable>
							<div></div>
						</template>
						<template v-slot:table-field="{ props, column }">
							<span
								v-if="column.viewer === 'icon' && props.item[model.nestedDataKey].length"
								@click="props.expand(!props.isExpanded)"
							>
								<v-icon v-if="!props.isExpanded">keyboard_arrow_right</v-icon>
								<v-icon v-if="props.isExpanded">keyboard_arrow_down</v-icon>
							</span>
						</template>
					</data-table>
				</td>
			</template>
			<template v-slot:item="props">
				<table-fields @deleteItem="deleteItem" :model="model" :parentProps="props">
					<template v-slot:table-field="fieldProps">
						<slot :props="fieldProps.props" :column="fieldProps.column" name="table-field"></slot>
					</template>
				</table-fields>
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
		height: {
			default() {
				return 400;
			},
			type: Number,
		},
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
		hideHeader: {
			type: Boolean,
			default() {
				return false;
			},
		},
		hideFooter: {
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
		dark: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	data() {
		return {
			expanded: [],
			queryVariables: {
				sortBy: 'updated_at',
				sortDesc: true,
			},
			itemPerPage: 10,
			page: 1,
			selected: [],
			loading: 0,
			items: [],
			itemsCount: null,
		};
	},
	watch: {
		page() {
			let table = this.$refs['dataTable'];
			let wrapper = table.$el.querySelector('div.v-data-table__wrapper');

			this.$vuetify.goTo(table); // to table
			this.$vuetify.goTo(table, { container: wrapper }); // to header
		},
	},
	apollo: {
		items: {
			fetchPolicy: 'network-only',
			query() {
				return this.queryGql;
			},
			// Reactive parameters
			variables() {
				// Use vue reactive properties here
				return {
					limit: this.itemPerPage,
					offset: (this.page - 1) * this.itemPerPage,
					order_by: {
						[this.sortBy]: this.sortDirection,
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
								limit: this.itemPerPage,
								offset: (this.page - 1) * this.itemPerPage,
								order_by: {
									[this.sortBy]: this.sortDirection,
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
			// let variables = {
			// 	limit: 10,
			// 	offset: 0,
			// 	order_by: {
			// 		updated_at: 'desc',
			// 	},
			// 	where: this.initialWhere,
			// }
			this.$apollo.queries.items.refetch();
		},
	},
};
</script>
<style></style>
