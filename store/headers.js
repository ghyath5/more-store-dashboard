import categoriesGql from '~/gql/categories/all.gql';
import permissionsGql from '~/gql/roles/permissions.gql';
// import orderStatusesGql from '~/gql/roles/permissions.gql';
export default {
	categoryHeaders: [
		{
			id: 1,
			text: 'Image',
			value: 'image',
			viewer: 'imageViewer',
			editor: 'imageUploader',
			connectKey: 'image_id',
			connectValue: 'id',
			width: 100, //in px
			sortable: false,
		},
		{
			id: 100,
			text: 'Category Name',
			value: 'name',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Name is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 150,
			text: 'Position',
			value: 'position',
			viewer: 'text',
			editor: 'numberEditor',
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 190,
			text: 'Parent',
			value: 'parent_id',
			objectValue: 'parent_category',
			editor: 'autocomplete',
			notViewable: true,
			settings: {
				queryGql: categoriesGql,
				itemValue: 'id',
				itemText: 'name',
				model: 'categories',
				orderBy: {
					parent_id: 'asc_nulls_first',
				},
				searchOptions: {
					key: 'name',
					op: '_ilike',
				},
			},
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
			id: 210,
			text: 'Display Mode',
			value: 'active',
			viewer: 'boolean',
			settings: {
				true: {
					text: 'Active',
					color: 'green',
				},
				false: {
					text: 'Disabled',
					color: 'red',
				},
			},
		},
		{
			id: 300,
			text: 'Actions',
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
	userHeaders: [
		{
			id: 100,
			text: 'Name',
			value: 'name',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Name is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 200,
			text: 'Email',
			value: 'email',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Email is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 300,
			text: 'Roles',
			value: 'roles',
			viewer: 'text',
			editor: 'autocomplete',
			sortable: false,
			settings: {
				queryGql: categoriesGql,
				itemValue: 'id',
				itemText: 'name',
				searchModel: 'categories',
				searchOptions: {
					key: 'name',
					op: '_ilike',
				},
			},
		},
		{
			id: 800,
			text: 'Updated At',
			value: 'updated_at',
			viewer: 'date',
			width: 180, //in px
			notEditable: true,
		},
		{
			id: 1000,
			text: '#',
			viewer: 'actions',
			value: 'actions',
			width: 50,
			sortable: false,
			notEditable: true,
		},
	],
	roleHeaders: [
		{
			id: 100,
			text: 'Name',
			value: 'name',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Name is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 200,
			text: 'Permissions',
			value: 'permissions',
			editor: 'autocomplete',
			notViewable: true,
			settings: {
				limit: 100,
				queryGql: permissionsGql,
				itemValue: 'name',
				itemText: 'name',
				connectItem: true,
				connectValue: 'permission', //required if connectItem
				many: true,
				model: 'permissions',
				searchOptions: {
					key: 'name',
					op: '_ilike',
				},
				multiple: true,
			},
		},
		{
			id: 800,
			text: 'Created At',
			value: 'created_at',
			viewer: 'date',
			width: 180, //in px
			notEditable: true,
		},
		{
			id: 1000,
			text: '#',
			viewer: 'actions',
			width: 50,
			sortable: false,
			notEditable: true,
		},
	],
	productHeaders: [
		{
			id: 1,
			text: 'Image',
			value: 'images',
			viewer: 'imageViewer',
			editor: 'imageUploader',
			many: true,
			mainType: 'thumbnail', //required if many
			width: 120, //in px
			sortable: false,
		},
		{
			id: 100,
			text: 'Sku',
			value: 'sku',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Sku is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 150,
			text: 'Name',
			value: 'name',
			viewer: 'text',
			editor: 'textEditor',
			rules: [v => !!v || 'Name is required'],
			settings: {
				// fieldWidth:70 //in %
			},
		},
		{
			id: 200,
			text: 'Description',
			value: 'description',
			viewer: 'text',
			editor: 'textareaEditor',
			rules: [v => !!v || 'Description is required'],
		},
		{
			id: 300,
			text: 'Regular Price',
			value: 'price',
			viewer: 'text',
			editor: 'numberEditor',
			rules: [v => !!v || 'Price is required'],
			editorSettings: {
				width: 50,
			},
		},
		{
			id: 320,
			text: 'Discount %',
			value: 'discount_percentage',
			viewer: 'text',
			editor: 'numberEditor',
			suffix: '%',
			inputClasses: '',
			editorSettings: {
				width: 50,
			},
		},
		{
			id: 340,
			text: 'Final Price',
			value: 'final_price',
			viewer: 'text',
			editor: 'numberEditor',
			notEditable: true,
		},
		{
			id: 350,
			text: 'In Stock',
			value: 'stock',
			viewer: 'text',
			editor: 'numberEditor',
			defaultValue: 1,
			editorSettings: {
				width: 50,
			},
		},
		// {
		// 	id: 400,
		// 	text: 'Categories',
		// 	value: 'categories',
		// 	editor: 'autocomplete',
		// 	objectValue: 'categories',
		// 	viewer: 'chipTags',
		// 	autocompleteSettings:{
		// 		object:'category'
		// 	},
		// 	viewSettings:{
		// 		objectName:'category',
		// 		noMsg:'No categories',
		// 		viewText:'name'
		// 	},
		// 	settings: {
		// 		limit: 100,
		// 		queryGql: categoriesGql,
		// 		itemValue: 'id',
		// 		itemText: 'name',
		// 		connectItem: true,
		// 		connectValue: 'category_id', //required if connectItem
		// 		many: true,
		// 		model: 'categories',
		// 		searchOptions: {
		// 			key: 'name',
		// 			op: '_ilike',
		// 		},
		// 		multiple: true,
		// 	},
		// },
		// {
		// 	id: 450,
		// 	text: 'Tags',
		// 	value: 'tags',
		// 	editor: 'autocomplete',
		// 	objectValue: 'tags',
		// 	viewer: 'chipTags',
		// 	autocompleteSettings:{
		// 		object:'tag'
		// 	},
		// 	viewSettings:{
		// 		objectName:'tag',
		// 		noMsg:'No tags',
		// 		viewText:'name'
		// 	},
		// 	settings: {
		// 		limit: 100,
		// 		queryGql: categoriesGql,
		// 		itemValue: 'id',
		// 		itemText: 'name',
		// 		connectItem: true,
		// 		connectValue: 'tag_id', //required if connectItem
		// 		many: true,
		// 		model: 'tags',
		// 		searchOptions: {
		// 			key: 'name',
		// 			op: '_ilike',
		// 		},
		// 		multiple: true,
		// 	},
		// },
		{
			id: 500,
			text: 'Featured',
			value: 'featured',
			viewer: 'boolean',
			editor: 'checkboxEditor',
			defaultValue: 1,
		},
		{
			id: 650,
			text: 'Images',
			value: 'images',
			editor: 'imagesUploader',
			notViewable: true,
		},
		{
			id: 800,
			text: 'Updated At',
			value: 'updated_at',
			viewer: 'date',
			width: 180, //in px
			notEditable: true,
		},
		{
			id: 1000,
			text: '#',
			viewer: 'actions',
			width: 50,
			sortable: false,
			notEditable: true,
		},
	],
	orderHeaders: [
		{
			id: 1,
			text: 'Order notes',
			value: 'notes',
			viewer: 'text',
		},
		{
			id: 20,
			text: 'Delivery Option',
			value: 'way',
			viewer: 'text',
		},
		{
			id: 100,
			text: 'Status',
			value: 'order_status',
			viewer: 'text',
			width: 140,
		},
		{
			id: 200,
			text: 'Driver',
			value: 'assigned_driver',
			viewer: 'text',
			sortable: false,
		},
		{
			id: 205,
			text: 'Client',
			value: 'client.name',
			viewer: 'text',
			sortable: false,
		},
		{
			id: 210,
			text: 'Order total cost',
			value: 'total_cost',
			viewer: 'function',
			function: ({ selected_products, delivery_way }, column, store) => {
				let cost =
					selected_products.reduce((prev, curr) => {
						prev = prev + curr.calculated_quantity_times_cost;
						return prev;
					}, 0) + delivery_way.cost;
				return cost + ' ' + store.state.currency.text;
			},
			sortable: false,
		},
		{
			id: 250,
			text: 'Created at',
			value: 'created_at',
			viewer: 'date',
		},
		{
			id: 290,
			text: 'Last update at',
			value: 'updated_at',
			viewer: 'date',
		},
	],
};
