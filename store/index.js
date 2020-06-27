import categoriesGql from '~/gql/categories/all.gql';
import permissionsGql from '~/gql/roles/permissions.gql';
export const state = () => ({
	categoryHeaders: [
		{
			id: 1,
			text: 'Image',
			value: 'image',
			viewer: 'imageViewer',
			editor: 'imageUploader',
			connectKey: 'image_id',
			width: 120, //in px
			sortable: false,
		},
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
			editor: 'autocomplete',
			notViewable: true,
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
			id: 150,
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
			id: 200,
			text: 'Description',
			value: 'description',
			viewer: 'text',
			editor: 'textareaEditor',
		},
		{
			id: 300,
			text: 'Regular Price',
			value: 'price',
			viewer: 'text',
			editor: 'numberEditor',
			rules: [v => !!v || 'Price is required'],
		},
		{
			id: 320,
			text: 'Discount %',
			value: 'discount_percentage',
			viewer: 'text',
			editor: 'numberEditor',
		},
		{
			id: 340,
			text: 'Final Price',
			value: 'final_price',
			viewer: 'text',
			editor: 'numberEditor',
			sortable: false,
			notEditable: true,
		},
		{
			id: 350,
			text: 'In Stock',
			value: 'stock',
			viewer: 'text',
			editor: 'numberEditor',
			defaultValue: 1,
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
	sidebar: false,
	me: false,
	token: '',
	isLoggedIn: false,
	permissions: [],
	roles: [],
	expireToken: 2, //in minuts
	snack: {
		text: '',
		active: false,
	},
	apiUrl: process.env.BASE_SERVER_URL || 'https://more-store-server.herokuapp.com',
	imagePath: process.env.GET_IMAGE_PATH || '/admin/image',
});

export const mutations = {
	setSnack(state, value) {
		state.snack = value;
	},
	toggleSidebar(state) {
		state.sidebar = !state.sidebar;
	},
	setUser: (state, value) => {
		state.me = value;
		let roles = value.roles.map(r => r.role);
		state.roles = roles.map(role => role.name);
		let permissions = new Set();
		roles.map(role => {
			role.permissions.map(p => {
				permissions.add(p.permission);
			});
		});
		state.permissions = [...permissions];
	},
	setSession: (state, { token, isLoggedIn }) => {
		state.token = token;
		state.isLoggedIn = isLoggedIn;
	},
};
export const actions = {
	async nuxtServerInit({ commit }, { req, app, redirect, store }) {
		// app.$REFRESH_TOKEN()
	},
};
