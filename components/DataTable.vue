<template>
	<div>
		<!-- <v-layout justify-center align-center column>
			<v-flex xs12> -->
		<slot name="aboveTable">
			<slot name="above-table-content"></slot>
			<slot
				name="createBtn"
				v-if="$has_permission(`create_${model.permission}`) || $has_permission(`manage_${model.permission}`)"
			>
				<v-btn class="mb-2" @click="$router.push(`/${model.name}/create`)" small color="info">
					Create
				</v-btn>
			</slot>
			<slot name="reload-btn">
				<v-btn @click="fetchData" class="mb-2 float-right" small>
					Reload Data
					<v-icon small>mdi-refresh</v-icon>
				</v-btn>
			</slot>
		</slot>
		<div style="clear:both"></div>
		<v-data-table
			ref="dataTable"
			:dark="dark"
			fixed-header
			:hide-default-footer="hideFooter"
			:hide-default-header="hideHeader"
			v-model="selected"
			@input="$emit('input', selected)"
			:headers="headers.filter(h => !h.notViewable)"
			:single-select="singleSelect"
			:server-items-length="data.count"
			:sort-by.sync="sortVariables.sortBy"
			:sort-desc.sync="sortVariables.sortDesc"
			:items-per-page.sync="itemPerPage"
			:page.sync="page"
			:items="data.items"
			:loading="!!loading"
			:show-select="showSelect"
			item-key="name"
			:expanded.sync="expanded"
			class="elevation-1 customDataTable"
			:class="{ 'child grey lighten-2': child }"
		>
			<template v-slot:expanded-item="props">
				<td class="pt-1 pb-2" style="z-index:1;position:relative" :colspan="headers.length">
					<data-table
						child
						class="ml-6"
						:headers="headers"
						:queryGql="queryGql"
						:deleteGql="deleteGql"
						:initialWhere="{
							parent_id: { _eq: props.item.id },
						}"
						:height="null"
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
						<template v-slot:table-field="fieldProps">
							<slot :props="fieldProps.props" :column="fieldProps.column" name="table-field"></slot>
						</template>
						<template v-slot:edit-btn="{ item }">
							<slot :item="item" name="edit-btn"></slot>
						</template>
						<template v-slot:delete-btn="{ item }">
							<slot :item="item" name="delete-btn"></slot>
						</template>
					</data-table>
				</td>
			</template>
			<template v-slot:item.data-table-select>s</template>
			<template v-slot:item="props">
				<tr>
					<td v-if="showSelect">
						<v-simple-checkbox
							color="primary"
							:value="props.isSelected"
							@input="props.select($event)"
						></v-simple-checkbox>
					</td>
					<table-fields
						@deleteItem="deleteItem"
						:model="model"
						:parentProps="props"
						v-for="column in props.headers"
						:key="column.id"
						:column="column"
					>
						<template v-slot:table-field="fieldProps">
							<slot :props="fieldProps.props" :column="fieldProps.column" name="table-field"></slot>
						</template>
						<template v-slot:edit-btn="{ item }">
							<slot :item="item" name="edit-btn"></slot>
						</template>
						<template v-slot:delete-btn="{ item }">
							<slot :item="item" name="delete-btn"></slot>
						</template>
					</table-fields>
				</tr>
			</template>
		</v-data-table>
		<!-- </v-flex>
		</v-layout> -->
	</div>
</template>
<script>
export default {
	name: 'DataTable',
	computed: {
		// tableHeight() {
		// 	let container = document.querySelector('.v-main__wrap') || { clientHeight: 700 };
		// 	return this.height ? container.clientHeight - 200 : null;
		// },
		sortDirection() {
			if (Array.isArray(this.sortVariables.sortDesc)) {
				return this.sortVariables.sortDesc[0] ? 'desc_nulls_last' : 'asc_nulls_last';
			}
			return this.sortVariables.sortDesc ? 'desc_nulls_last' : 'asc_nulls_last';
		},
		sortBy() {
			if (Array.isArray(this.sortVariables.sortBy)) {
				return this.sortVariables.sortBy[0] ? this.sortVariables.sortBy[0] : this.defaultSortBy;
			}
			return this.sortVariables.sortBy ? this.sortVariables.sortBy : this.defaultSortBy;
		},
		queryVariables() {
			let searchKeys = !this.child ? this.model.searchKeys || ['name'] : [];
			let vars = {
				limit: this.itemPerPage,
				offset: (this.page - 1) * this.itemPerPage,
				order_by: {
					[this.sortBy]: this.sortDirection,
				},
				where: {
					...this.initialWhere,
				},
			};
			if (this.$store.state.search && searchKeys.length) {
				vars.where._or = [];
				// let obj = {}
				searchKeys.map(key => {
					let splitedKey = key.split('.');
					let obj = {};
					splitedKey.reduce((ob, curr, i) => {
						ob[curr] = i + 1 === splitedKey.length ? { _ilike: `%${this.$store.state.search}%` } : {}; //assigned_driver.driver.name
						// console.log(ob);
						obj[curr] = ob[curr];
						return ob[curr];
					}, {});
					let firstKey = Object.keys(obj)[0];
					vars.where._or.push({
						[firstKey]: obj[firstKey],
					});
				});
			}

			return vars;
		},
	},
	props: {
		value: {
			type: Array,
			default() {
				return [];
			},
		},
		defaultSortBy: {
			default() {
				return 'updated_at';
			},
			type: String,
		},
		height: {
			default() {
				return 460;
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
		subscriptionGql: {
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
		child: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	data() {
		return {
			expanded: [],
			sortVariables: {
				sortBy: this.defaultSortBy,
				sortDesc: true,
			},
			itemPerPage: 10,
			page: 1,
			selected: [],
			loading: 1,
			data: { items: [], count: 0 },
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
		data: {
			fetchPolicy: 'network-only',
			query() {
				return this.queryGql;
			},
			debounce: 500,
			variables() {
				return this.queryVariables;
			},
			deep: true,
			update(data) {
				return {
					items: data[this.model.name],
					count: data[this.model.aggregate].aggregate.count,
				};
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			watchLoading(v) {
				this.loading = v;
			},
		},
	},
	methods: {
		deleteItem(item) {
			if (
				!this.$has_permission(`delete_${this.model.permission}`) &&
				!this.$has_permission(`manage_${this.model.permission}`)
			)
				return;
			let pk = this.model.pk || 'id';
			const mutationOptions = {
				mutation: this.deleteGql,
				variables: {
					[pk]: item[pk],
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
							i => i[pk] === data['delete_' + this.model.name + '_by_pk'][pk]
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
			this.$apollo.queries.data.refetch();
		},
		subscribeToMore() {
			this.$apollo.queries.data.subscribeToMore({
				document: this.subscriptionGql,
				variables() {
					return this.queryVariables;
				},
				updateQuery(previousResult, { subscriptionData }) {
					if (!subscriptionData[this.model.name]) return;
					previousResult[this.model.name] = subscriptionData[this.model.name];
				},
			});
		},
	},
	mounted() {
		this.$nextTick(() => {
			if (this.subscriptionGql) {
				this.subscribeToMore();
			}
		});
	},
};
</script>
<style scoped>
* >>> table thead th {
	white-space: nowrap !important;
}
* >>> div:not(.child) .v-data-table__wrapper {
	max-height: 460px !important;
}
</style>
