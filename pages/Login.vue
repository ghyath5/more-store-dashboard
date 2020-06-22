<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4">
			<v-card class="elevation-12">
				<v-card-text>
					<v-form>
						<v-text-field
							label="Login"
							v-model="email"
							prepend-icon="mdi-account"
							type="text"
						></v-text-field>

						<v-text-field
							id="password"
							label="Password"
							v-model="password"
							prepend-icon="mdi-lock"
							type="password"
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="login" color="primary">Login</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
import LoginGql from '~/graphql/auth/login.gql';
export default {
	layout: 'auth',
	data() {
		return {
			email: 'emai@email.email',
			password: 'ghghgh',
		};
	},
	methods: {
		async login() {
			const authClient = this.$apollo.provider.clients.auth;
			let { data } = await authClient
				.mutate({
					mutation: LoginGql,
					variables: {
						data: {
							email: this.email,
							password: this.password,
						},
					},
				})
				.catch(e => {
					console.log(e);
				});
			await this.$SET_COOKIE('refresh_token', data.adminLogin.refresh_token, 15);
			this.$store.commit('setSession', {
				token: data.adminLogin.token,
				isLoggedIn: true,
			});
			this.$router.push('/');
		},
	},
};
</script>
