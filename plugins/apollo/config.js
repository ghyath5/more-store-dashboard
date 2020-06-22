export default function({ store, app, req }) {
	const token = () => {
		return store.state.token;
	};
	return {
		httpEndpoint: 'https://more-store.herokuapp.com/v1/graphql',
		wsEndpoint: 'wss://more-store.herokuapp.com/v1/graphql',
		getAuth: () => `Bearer ${token()}`,
	};
}
