<template>
	<v-container fill-height fluid>
		<v-row justify="center">
			<v-col cols="12" md="8">
				<material-card class="v-card-profile pa-0 my-1">
					<v-avatar slot="offset" class="mx-auto d-block elevation-3" size="100">
						<v-icon size="100" color="secondary">account_circle</v-icon>
					</v-avatar>
					<v-card-text class="text-center pa-0">
						<h6 class="overline mb-1">
							{{ $store.state.me.name }}
						</h6>

						<h4 class="font-weight-light">
							<v-chip v-for="role in $store.state.roles" :key="role" class="ma-2" color="primary">
								{{ role }}
							</v-chip>
						</h4>
						<template v-if="!$store.state.roles.includes('admin')">
							<h4>permmissions</h4>
							<v-chip small v-for="permission in $store.state.permissions" :key="permission" class="ma-2">
								{{ permission }}
							</v-chip>
						</template>
						<template v-else>
							<p>You are an admin, you have full control</p>
						</template>
					</v-card-text>
				</material-card>
				<!-- <material-card title="Edit Profile" text="Complete your profile"> -->
				<v-form v-model="formValidat" ref="form" class="white">
					<v-container class="py-0 px-4">
						<v-row align="center" justify="center">
							<v-col cols="12" md="10">
								<v-text-field v-model="userData.name" label="Name" />
							</v-col>

							<v-col cols="12" md="6">
								<v-text-field v-model="userData.email" label="Email Address" class="purple-input" />
							</v-col>

							<v-col cols="12" md="4">
								<v-text-field
									v-model="userData.mobile_number"
									label="Phone number"
									class="purple-input"
								/>
							</v-col>

							<v-col cols="10" class="text-right">
								<v-btn :loading="loading" color="success" @click="updateProfile">
									Update Profile
								</v-btn>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
				<!-- </material-card> -->
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import updateProfileGql from '~/gql/users/update.gql';
export default {
	created() {
		this.userData = { ...this.$store.state.me };
	},
	data() {
		return {
			loading: false,
			userData: {},
			formValidat: true,
			editableColumns: ['email', 'mobile_number', 'name'],
		};
	},
	methods: {
		async updateProfile() {
			this.loading = true;
			let _set = {};
			this.editableColumns.map(col => {
				_set[col] = this.userData[col];
			});
			let { data } = await this.$apollo.mutate({
				mutation: updateProfileGql,
				variables: {
					where: {
						id: { _eq: this.userData.id },
					},
					_set,
				},
			});
			this.loading = false;
			this.$store.commit('setSnack', {
				active: true,
				color: 'success',
				text: 'Your profile has been updated',
			});
			this.$store.commit('setUser', data.update_users.returning[0]);
		},
	},
};
</script>
