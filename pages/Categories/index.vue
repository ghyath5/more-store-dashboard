<template>
	<div style="margin-top:-33px">
		<data-table
			:headers="$store.state.categoryHeaders"
			:queryGql="categoriesGql"
			:deleteGql="deleteGql"
			:initialWhere="{
				parent_id: { _is_null: true },
			}"
			:model="{
				name: 'categories',
				objectName: 'Category',
				permission: 'categories',
				aggregate: 'categories_aggregate',
				nestedDataKey: 'sub_categories',
				searchKeys: ['name'],
			}"
		>
			<template v-slot:table-field="{ props, column }">
				<span
					v-if="column.viewer === 'icon' && props.item['sub_categories'].length"
					@click="props.expand(!props.isExpanded)"
				>
					<v-icon v-if="!props.isExpanded">keyboard_arrow_right</v-icon>
					<v-icon v-if="props.isExpanded">keyboard_arrow_down</v-icon>
				</span>
			</template>
			<template v-slot:edit-btn="{ item }">
				<v-btn
					x-small
					width="80"
					color="blue"
					rounded
					class="capitalize white--text"
					:to="`/categories/${item.id}/update`"
				>
					Edit
				</v-btn>
			</template>
		</data-table>
	</div>
</template>
<script>
import categoriesGql from '~/gql/categories/all.gql';
import deleteGql from '~/gql/categories/delete.gql';
export default {
	data() {
		return {
			categoriesGql,
			deleteGql,
		};
	},
	mounted() {
		this.$store.commit('setPageDetails', {
			pageTitle: 'Categories',
		});
	},
};
</script>
