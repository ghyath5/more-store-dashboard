<template>
	<div>
		<label>{{label}}</label>
		<v-autocomplete
			v-model="selected"
			:search-input.sync="search"
			:items="items"
			height="33"
			class="auto-complete"
			outlined
			dense
			color="blue"
			:item-text="itemText"
			:item-value="itemValue"
			:multiple="multiple"
			clearable
			@click="getItems"
			:return-object="returnObject"
			:loading="searchLoading"
			@change="selectItem"
			hide-details
			:no-data-text="searchLoading?'Loading...':'No results found'"
			:menu-props="{ auto: true }"
			small-chips
		>
		 <template v-slot:selection="{item}">
			 <!-- <span style="white-space:nowrap" class="text-caption">{{item.name}}</span> -->
		</template>
		</v-autocomplete>
	</div>
</template>
<script>
import { debounce } from 'lodash';
export default {
	name: 'AutoComplete',
	props: {
		label: {
			type: String,
			default() {
				return 'data';
			},
		},
		returnObject: {
			type: Boolean,
			default() {
				return false;
			},
		},
		queryGql: {
			type: Object,
			default() {
				return null;
			},
		},
		value: {
			type: null,
			default() {
				return null;
			},
		},
		itemValue: {
			type: String,
			default() {
				return null;
			},
		},
		itemText: {
			type: String,
			default() {
				return null;
			},
		},
		searchOptions: {
			type: Object,
			default() {
				return {
					key: 'name',
					op: '_ilike',
				};
			},
		},
		initialOrderBy: {
			type: Object,
			default() {
				return {
					id: 'asc',
				};
			},
		},
		initialWhere: {
			type: Object,
			default() {
				return {};
			},
		},
		searchModel: {
			type: String,
			default() {
				return null;
			},
		},
		multiple: {
			type: Boolean,
			default() {
				return false;
			},
		},
		limit: {
			type: Number,
			default() {
				return 10;
			},
		},
		settings: {
			type: Object,
			default() {
				return null;
			},
		},
	},
	data: () => ({
		items: [],
		search: '',
		selected: {},
		searchLoading: false,
	}),
	watch: {
		search(newVal, oldVal) {
			if (!this.search) return;
			this.getItemsDebounced();
		},
	},
	created() {
		let copiedValue = this.value;
		if (Array.isArray(this.value)) {
			copiedValue = this.value.map(v => {
				let value = v[this.settings.object];
				return {
					[this.itemValue]: value[this.itemValue],
					[this.itemText]: value[this.itemText],
				};
			});
		}
		this.selected = copiedValue;
		if (this.selected) {
			this.items = Array.isArray(copiedValue) ? copiedValue : [copiedValue];
		}

		this.getItemsDebounced = debounce(function() {
			this.getItems();
		}, 400);
	},
	computed: {
		searchValue() {
			if (this.searchOptions.op.includes('like')) {
				return this.search ? `%${this.search}%` : '%%';
			}
			return this.search ? this.search : '';
		},
	},
	methods: {
		selectItem(item) {
			if (!item) return;
			this.$emit('input', item);
		},
		async getItems() {
			this.searchLoading = true;
			await this.$apollo
				.query({
					query: this.queryGql,
					variables: {
						limit: this.limit,
						order_by: this.initialOrderBy,
						where: {
							...this.initialWhere,
							[this.searchOptions.key]: { [this.searchOptions.op]: this.searchValue },
						},
					},
				})
				.then(({ data }) => {
					this.searchLoading = false;
					this.items = data[this.searchModel];
				});
		},
	},
};
</script>
<style>
	.auto-complete .v-input__slot{
		padding:0 !important
	}
	.auto-complete .v-input__append-inner{
		margin: 0;
	}
</style>