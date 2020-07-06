<template>
	<v-container fluid>
		<data-table
			:headers="$store.state.productHeaders"
			:queryGql="queryGql"
			:deleteGql="deleteGql"
			:model="{
				name: 'products',
				permission: 'products',
				aggregate: 'products_aggregate',
				searchKeys: ['sku', 'name', 'description'],
			}"
		>
			<template v-slot:createBtn>
				<v-btn class="mb-2" @click="$router.push(`/products/create`)" small color="info">Create</v-btn>
			</template>
			<template v-slot:table-field="{ props: { item }, column }">
				<template v-if="column.value === 'discount_percentage'">
					<span v-if="item[column.value]">{{ item[column.value] }}%</span>
					<span v-else class="red--text">No discount</span>
				</template>
			</template>
		</data-table>
	</v-container>
</template>
<script>
import queryGql from '~/gql/products/all.gql';
import deleteGql from '~/gql/products/delete.gql';
export default {
	data() {
		return {
			queryGql,
			deleteGql,
		};
	},
};
</script>
