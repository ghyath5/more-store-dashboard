<template>
	<v-container fluid>
		<data-table
			:headers="$store.state.categoryHeaders"
			:queryGql="categoriesGql"
			:deleteGql="deleteGql"
			:initialWhere="{
				parent_id: { _is_null: true },
			}"
			:model="{
				name: 'categories',
				permission: 'categories',
				aggregate: 'categories_aggregate',
				nestedDataKey: 'sub_categories',
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
				<nuxt-link style="text-decoration:none" :to="`/categories/${item.id}/update`">
					<v-icon color="blue" class="pointer" :size="18">
						mdi-square-edit-outline
					</v-icon>
				</nuxt-link>
			</template>
		</data-table>
	</v-container>
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
};
</script>
