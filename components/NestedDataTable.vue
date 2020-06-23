<template>
	<v-data-table dark :headers="headers" :items="items" :item-key="itemKey" :expanded.sync="expanded">
		<template v-slot:expanded-item="props">
			<slot name="expanded-item" :props="props">
				<td :colspan="headers.length">
					<nested-data-table
						:parentData="parentData"
						:headers="headers"
						:items="props.item[parentData.model.nestedDataKey]"
					/>
				</td>
			</slot>
		</template>
	</v-data-table>
</template>
<script>
export default {
	name: 'nested-data-table',
	props: {
		parentData: {
			default() {
				return {};
			},
			type: Object,
		},
		headers: {
			default() {
				return [];
			},
			type: Array,
		},
		items: {
			default() {
				return [];
			},
			type: Array,
		},
		itemKey: {
			default() {
				return 'name';
			},
			type: String,
		},
	},
	data() {
		return {
			expanded: [],
		};
	},
};
</script>
