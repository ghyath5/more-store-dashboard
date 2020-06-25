import categoriesGql from '~/gql/categories/all.gql';
export const state = () => ({
	categoryHeaders: [
		{
			id: 1,
			text: 'Image',
			value: 'image',
			viewer: 'imageViewer',
			editor: 'imageUploader',
			connectKey: 'image_objectId',
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
	apiUrl: process.env.BASE_SERVER_URL,
	imagePath: process.env.GET_IMAGE_PATH,
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
