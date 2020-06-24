<template>
	<v-autocomplete
		v-model="selected"
		:search-input.sync="search"
		:items="items"
		color="blue-grey lighten-2"
		:label="label"
		:item-text="itemText"
		:item-value="itemValue"
		:multiple="multiple"
		:return-object="returnObject"
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
		searchModel: {
			type: String,
			default() {
				return null;
			},
		},
	},
	data: () => ({
		items: [],
		search: '',
		selected: {},
	}),
	watch: {
		search(newVal, oldVal) {
			if (!this.search || this.search.length < 1) return;
			this.getItemsDebounced();
		},
	},
	created() {
		this.selected = this.value;
		if (this.selected) {
			this.items = [this.value];
		}
		this.getItemsDebounced = debounce(function() {
			this.getItems();
		}, 400);
	},
	computed: {
		searchValue() {
			if (this.searchOptions.op.includes('like')) {
				return `%${this.search}%`;
			}
			return this.search;
		},
	},
	methods: {
		async getItems() {
			await this.$apollo
				.query({
					query: this.queryGql,
					variables: {
						limit: 10,
						where: {
							[this.searchOptions.key]: { [this.searchOptions.op]: this.searchValue },
						},
					},
				})
				.then(({ data }) => {
					console.log(data);
					// this.searchLoading = false
					this.items = data[this.searchModel];
					console.log(this.searchModel);
				});
		},
	},
};
</script>
