<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4" xl="3">
			<v-row align="center" justify="center" class="mb-6">
				<v-img src="/logo.png" height="40" width="76" contain />
			</v-row>
			<v-card :loading="loading" flat class="pa-5 text-center">
				<h3 class="mb-4 mt-4 text-h4 font-weight-bold">
					Login to Account
				</h3>
				<p style="font-size:13px" class="mb-8">
					Please enter your email and password to continue
				</p>
				<v-card-text>
					<v-form>
						<label class="text-subtitle-1 ml-5 my-2 fon-bold primary--text text-left d-block">
							Email address
						</label>
						<v-text-field
							v-model="email"
							hide-details
							height="42"
							type="text"
							dense
							outlined
							single-line
							flat
						/>
						<label class="text-subtitle-1 ml-5 my-2 mt-6 font-weig primary--text text-left d-block">
							Password
						</label>
						<v-text-field
							id="password"
							v-model="password"
							type="password"
							dense
							outlined
							height="42"
							single-line
							flat
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-col cols="12">
						<div class="px-10">
							<v-btn
								class="text-body-1 rounded-10 pa-2"
								@click="login"
								:disabled="loading"
								block
								color="secondary"
								height="45"
							>
								Login
							</v-btn>
						</div>
					</v-col>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
import LoginGql from '~/gql/auth/login.gql';
import MeGql from '~/gql/users/all.gql';
export default {
	layout: 'auth',
	data() {
		return {
			email: 'ghyath@admin.admin',
			password: 'ghghgh',
			loading: false,
		};
	},
	methods: {
		async login() {
			const authClient = this.$apollo.provider.clients.auth;
			this.loading = true;
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
			let userRes = await this.$apollo
				.query({
					fetchPolicy: 'network-only',
					query: MeGql,
					variables: {
						where: {
							id: { _eq: data.adminLogin.user_id },
						},
					},
				})
				.catch(async e => {
					console.log(e);
				});
			this.loading = false;
			this.$store.commit('setUser', userRes.data.users[0]);
			this.$router.push('/');
		},
	},
};
</script>

<style>
.v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
	min-height: 26px;
}
.v-text-field--outlined.v-input--dense .v-label {
	top: 6px !important;
}
</style>
