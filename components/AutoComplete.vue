<template>
	<v-autocomplete
		v-model="selected"
		:search-input.sync="search"
		:items="items"
		color="blue"
		:label="label"
		:item-text="itemText"
		:item-value="itemValue"
		:multiple="multiple"
		clearable
		@click="getItems"
		:return-object="returnObject"
		:loading="searchLoading"
		@change="selectItem"
	>
		<!-- <template v-slot:selection="data">
        <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="remove(data.item)"
        >
            <v-avatar left>
            <v-img :src="data.item.avatar"></v-img>
            </v-avatar>
            {{ data.item.name }}
        </v-chip>
        </template> -->
		<!-- <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
            <v-list-item-avatar>
            <img :src="data.item.avatar">
            </v-list-item-avatar>
            <v-list-item-content>
            <v-list-item-title v-html="data.item.name"></v-list-item-title>
            <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
        </template>
        </template> -->
	</v-autocomplete>
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
