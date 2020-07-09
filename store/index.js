import headers from './headers';
export const state = () => ({
	...headers,
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
	pageDetails: {
		pageTitle: 'Dashboard',
	},
	apiUrl: process.env.BASE_SERVER_URL || 'https://more-store-server.herokuapp.com',
	imagePath: process.env.GET_IMAGE_PATH || '/admin/image',
	search: '',
	pageSearch: '',
	currency: {
		text: 'AED',
	},
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
	setSearch: (state, v) => {
		state.search = v;
	},
	setPageSearch: (state, v) => {
		state.pageSearch = v;
	},
};
export const actions = {
	async nuxtServerInit({ commit }, { req, app, redirect, store }) {
		// app.$REFRESH_TOKEN()
	},
};
