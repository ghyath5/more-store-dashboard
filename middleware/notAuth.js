// import Cookies from 'js-cookie'
export default function({ app, error, redirect, req }) {
	const refreshToken = !!app.$GET_COOKIE('refresh_token');
	if (refreshToken) {
		redirect('/');
	}
}
