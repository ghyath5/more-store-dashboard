export const state = () => ({
	sidebar: false,
	me: false,
	token: '',
	isLoggedIn: false,
	permissions: [],
	roles: [],
	expireToken: 3, //in minuts
});

export const mutations = {
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
