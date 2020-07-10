export default function({ store }) {
	const token = () => {
		return store.state.token;
	};
	return {
		httpEndpoint: 'https://more-store.herokuapp.com/v1/graphql',
		wsEndpoint: 'wss://more-store.herokuapp.com/v1/graphql',
		getAuth: () => `Bearer ${token()}`,
	};
}
