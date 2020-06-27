<template>
	<v-container>
		<data-table
			:headers="$store.state.productHeaders"
			:queryGql="queryGql"
			:model="{
				name: 'products',
				permission: 'products',
				aggregate: 'products_aggregate',
			}"
		>
			<template v-slot:createBtn>
				<v-btn class="mb-2" @click="$router.push(`/products/create`)" small color="info">Create</v-btn>
			</template>
			<template v-slot:table-field="{ props: { item }, column }">
				<template v-if="column.value === 'discount_percentage'">
					<span>{{ item[column.value] }}%</span>
				</template>
			</template>
		</data-table>
	</v-container>
</template>
<script>
import queryGql from '~/gql/products/all.gql';
// import deleteGql from '~/gql/users/delete.gql';
export default {
	data() {
		return {
			queryGql,
			// deleteGql,
		};
	},
};
</script>
