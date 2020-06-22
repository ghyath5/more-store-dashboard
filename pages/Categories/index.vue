<template>
	<v-container>
		<data-table
			:headers="headers"
			:queryGql="categoriesGql"
			:model="{ name: 'categories', aggregate: 'categories_aggregate' }"
		/>
	</v-container>
</template>
<script>
import categoriesGql from '~/graphql/categories/all.gql';
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
			],
			categoriesGql,
		};
	},
};
</script>
