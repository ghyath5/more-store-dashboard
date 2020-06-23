import gql from 'graphql-tag';
import MeGql from '~/gql/users/all.gql';
export default async ({ app, req, redirect }, inject) => {
	let authClient = app.apolloProvider.clients.auth;
	let client = app.apolloProvider.defaultClient;
	inject('LOGOUT', async () => {
		await app.$REMOVE_COOKIE('refresh_token');
		app.store.commit('setSession', {
			token: '',
			isLoggedIn: false,
		});
		redirect('/login');
	});
	inject('REFRESH_TOKEN', async () => {
		let error = false;
		const refresh_token = app.$GET_COOKIE('refresh_token');
		if (!refresh_token) {
			return false;
		}
		let res = await authClient
			.mutate({
				mutation: gql`
					mutation refresh {
						admin_refresh_token {
							refresh_token
							token
							user_id
						}
					}
				`,
				context: {
					headers: {
						'x-refresh-token': refresh_token,
					},
				},
			})
			.catch(async e => {
				if (
					e &&
					e.graphQLErrors &&
					e.graphQLErrors[0] &&
					e.graphQLErrors[0].message.includes('Not Authorized')
				) {
					await app.$LOGOUT();
					window.location.herf = '/login';
				}
				error = true;
				return;
			});
		let data = res && res.data ? res.data : false;
		if (!data || error) {
			return false;
		}
		// refresh session
		app.$SET_COOKIE('refresh_token', data.admin_refresh_token.refresh_token, 15);
		app.store.commit('setSession', {
			token: data.admin_refresh_token.token,
			isLoggedIn: true,
		});
		let userRes = await client
			.query({
				query: MeGql,
				variables: {
					where: {
						id: { _eq: data.admin_refresh_token.user_id },
					},
				},
			})
			.catch(async e => {
				//FIRE LOGOUT
				console.log(e);

				error = true;
			});
		if (error) return false;
		app.store.commit('setUser', userRes.data.users[0]);
		return true;
	});
	if (!!app.$GET_COOKIE('refresh_token')) {
		setInterval(() => {
			app.$REFRESH_TOKEN();
		}, app.store.state.expireToken * 60 * 1000);
	}
};
