<template>
	<v-container>
		<data-table
			:headers="headers"
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
		</data-table>
	</v-container>
</template>
<script>
import categoriesGql from '~/gql/categories/all.gql';
import deleteGql from '~/gql/categories/delete.gql';
export default {
	data() {
		return {
			headers: [
				{
					id: 1,
					text: 'Image',
					value: 'image',
					viewer: 'imageViewer',
					editor: 'imageUploader',
					width: 120, //in px
					sortable: false,
				},
				{
					id: 100,
					text: 'Name',
					value: 'name',
					viewer: 'text',
					editor: 'textEditor',
				},
				{
					id: 150,
					text: 'Position',
					value: 'position',
					viewer: 'text',
					editor: 'textEditor',
				},
				{
					id: 200,
					text: 'Updated At',
					value: 'updated_at',
					viewer: 'date',
					width: 180, //in px
					notEditable: true,
				},
				{
					id: 300,
					text: '#',
					viewer: 'actions',
					width: 50,
					sortable: false,
					notEditable: true,
				},
				{
					id: 400,
					text: '',
					viewer: 'icon',
					width: 30,
					sortable: false,
					notEditable: true,
				},
			],
			categoriesGql,
			deleteGql,
		};
	},
};
</script>
