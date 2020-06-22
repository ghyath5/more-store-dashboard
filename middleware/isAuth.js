// import Cookies from 'js-cookie'
export default async function({ app, error, redirect, req }) {
	const refreshToken = !!app.$GET_COOKIE('refresh_token');
	if (refreshToken && (!app.store.state.isLoggedIn || !app.store.state.token)) {
		await app.$REFRESH_TOKEN();
	}
	if (!refreshToken || !app.store.state.isLoggedIn) {
		await app.$LOGOUT();
	}
}
