<template>
	<div>
		<!-- <v-layout justify-center align-center column>
			<v-flex xs12> -->
		<slot name="aboveTable">
			<v-row justify="space-between" align="center" dense align-content="center">
				<v-col>
					<h4 class="primary--text pt-2 pb-4 px-5">{{$store.state.pageDetails.pageTitle}}</h4>
				</v-col>
				<v-col class="text-right">
					<slot
						name="createBtn"
						v-if="$has_permission(`create_${model.permission}`) || $has_permission(`manage_${model.permission}`)"
					>
						<v-btn outlined @click="$router.push(`/${model.name}/create`)" small rounded>
							Create new {{model.objectName}}
						</v-btn>
					</slot>
				</v-col>
			</v-row>
			
			
			<!-- <slot name="above-table-content"></slot> -->
			
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
			class="customDataTable white"
			:class="{ 'child grey lighten-2': child }"
			style="border-radius:10px 10px 0 0"
		>	
			<template v-slot:top>
				<div class="white pa-1" style="border-radius:10px 10px 0 0">
					<v-row dense justify="space-around">
						<v-col md="7">
							<v-row dense justify="space-between">
								<v-col>
									Page count 
								</v-col>
								<v-col>
									<v-text-field
									append-icon="search"
									label="Search"
									v-model="search"
									hide-details
									height="25"
									rounded
									dense
									filled
									single-line
									/>
								</v-col>
							</v-row>
						</v-col>

						<v-col md="5" class="text-center">
							<v-row dense>
								<v-col>
									<slot name="export-btn">
										<v-btn class="above-table-button" height="32" @click="fetchData" rounded outlined small>
											<v-icon size="15">mdi-content-save-outline</v-icon>
											Export
										</v-btn>
									</slot>
									<slot name="reload-btn">
										<v-btn class="above-table-button" height="32" @click="fetchData" rounded outlined small>
											<v-icon size="15">mdi-sync</v-icon>
											Refresh
										</v-btn>
									</slot>
									<slot name="reset-btn">
										<v-btn class="above-table-button" height="32" @click="fetchData" rounded outlined small>
											<v-icon size="15">mdi-refresh</v-icon>
											Reset
										</v-btn>
									</slot>
									<slot name="columns-btn">
										<v-btn class="above-table-button" height="32" @click="fetchData" rounded outlined small>
											<v-icon size="15">mdi-eye-outline</v-icon>
											Columns
										</v-btn>
									</slot>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</div>
			</template>
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
		search: {
			get() {
				return this.$store.state.search;
			},
			set(v) {
				this.$store.commit('setSearch', v);
			},
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
	max-height: 400px !important;
	/* background:transparent */
}
* >>> thead tr th:first-of-type, tbody tr td:first-of-type {
	border-radius: 10px 0 0 10px;
}
* >>>  thead tr th:last-of-type, tbody tr td:last-of-type {
	border-radius: 0 10px 10px 0
}

* >>> thead tr th{
	background:#000 !important;
	color:white !important
}
* >>> thead tr th i{
	color:white !important
}
tbody tr td{
	border-bottom:1px solid #000 !important;
	border-top:1px solid #000 !important;
}
* >>> .customDataTable table{
	border-collapse:separate; 
	border-spacing:0 5px; 
}
tbody tr td:first-of-type{
	border-left:1px solid #000 !important
}
tbody tr td:last-of-type{
	border-right:1px solid #000 !important
}
/* tr:hover ,tr:hover * >>> tr td div button:before {
	background-color: #0678ec !important;
	color:white !important
} */
.above-table-button{
	padding:2px
}

/* .search-box{
	border: 1px solid #d8d8d8 !important;
}
.search-box label {
	font-size:12px !important;
	color:#ababab !important
}
.v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot { 
	min-height: 26px;
	background:transparent !important
}
.v-text-field--filled.v-input--dense .v-label{
	top:3px !important
} */
</style>
