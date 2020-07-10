export default ({ graphQLErrors, networkError, operation, forward }, { app }) => {	
	if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].extensions && graphQLErrors[0].extensions.code) {
		if (graphQLErrors[0].extensions.code.includes('invalid') && graphQLErrors[0].extensions.code.includes('jwt')) {
			// app.$REFRESH_TOKEN()
			if (process.browser) {
				window.location.reload();
			}
		}
	}
};
