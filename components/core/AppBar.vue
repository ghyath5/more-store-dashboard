<template>
	<v-app-bar fixed clipped-left id="core-app-bar" app color="white" elevation="1" height="62">
		<div :style="'min-width:' + drawerWidth + 'px'" class="hidden-sm-and-down">
			<v-img class="ma-auto" src="/logo.png" height="50" width="105" contain />
		</div>

		<v-container class="px-10" :fluid="$vuetify.breakpoint.lgAndDown">
			<v-row dense no-gutters justify="space-between" align="center" class="mx-0 px-0">
				<v-col sm="5" md="8" xl="8" class="py-0 px-0 text-left">
					<v-row dense no-gutters align="center" class="mx-0">
						<v-row dense no-gutters align="center">
							<v-btn class="mr-lg-6 pa-0" icon @click.stop="onClick">
								<v-icon>mdi-view-list</v-icon>
							</v-btn>
							<v-col md="5" lg="6" xl="7" class="py-0 search-column hidden-sm-and-down">
								<v-text-field
									class="search-box search-field"
									label="Search"
									v-model="search"
									hide-details
									rounded
									height="35"
									dense
									filled
									single-line
								>
									<template v-slot:prepend-inner>
										<div style="margin-top:-2px">
											<v-icon size="22" color="#ababab">
												search
											</v-icon>
										</div>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-col sm="8" md="4">
							<div class="text-h5 font-weight-bold mb-0" style="height:22px">
								{{ time }}
								<span style="font-size:12px;">{{ localTime }}</span>
							</div>
							<div style="font-size:12px" class="blue--text">{{ date }}</div>
						</v-col>
					</v-row>
				</v-col>
				<v-col sm="5" md="4" lg="4" class="mx-0 text-right">
					<v-menu bottom left offset-y transition="slide-y-transition">
						<template v-slot:activator="{ attrs, on }">
							<v-btn class="toolbar-items mr-4" icon v-bind="attrs" v-on="on">
								<v-badge color="error" overlap>
									<template slot="badge">
										{{ notifications.length }}
									</template>
									<v-icon color="tertiary">
										mdi-bell-outline
									</v-icon>
								</v-badge>
							</v-btn>
						</template>

						<v-card>
							<v-list dense>
								<v-list-item v-for="notification in notifications" :key="notification" @click="onClick">
									<v-list-item-title v-text="notification" />
								</v-list-item>
							</v-list>
						</v-card>
					</v-menu>

					<v-menu bottom left offset-y>
						<template v-slot:activator="{ on }">
							<v-btn class="pl-1 pt-0" elevation small rounded outlined v-on="on">
								<v-icon size="19">mdi-chevron-down</v-icon>
								{{ $store.state.me.name }}
							</v-btn>
						</template>
						<v-card>
							<v-list dense>
								<v-hover v-slot:default="{ hover }">
									<nuxt-link
										v-for="accountList in accountLists"
										:key="accountList.text"
										style="text-decoration:none"
										:to="accountList.to"
									>
										<v-list-item dense class="pointer account-list" :class="{ secondary: hover }">
											<v-list-item-title
												:class="{ 'white--text': hover }"
												v-text="accountList.text"
											/>
										</v-list-item>
									</nuxt-link>
								</v-hover>
								<v-divider />
								<v-hover v-slot:default="{ hover }">
									<v-list-item
										@click="$LOGOUT()"
										dense
										class="pointer account-list"
										:class="{ secondary: hover }"
									>
										<v-list-item-title :class="{ 'white--text': hover }">Logout</v-list-item-title>
									</v-list-item>
								</v-hover>
							</v-list>
						</v-card>
					</v-menu>
					<v-icon color="tertiary">
						mdi-account-outline
					</v-icon>
				</v-col>
			</v-row>
		</v-container>
	</v-app-bar>
</template>

<script>
// Utilities
import { mapMutations } from 'vuex';

export default {
	data: () => ({
		accountLists: [
			{
				text: 'My account',
				to: '/me',
			},
		],
		notifications: [
			'Notification',
			'Another Notification',
			'Another One',
		],
		title: null,
		responsive: true,
		monthNames: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
		days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

		date: '',
		time: '',
		localTime: '',
	}),
	computed: {
		drawerWidth() {
			if (this.$vuetify.breakpoint.mdAndDown) {
				return 220;
			} else if (this.$vuetify.breakpoint.lgOnly) {
				return 270;
			} else {
				return 330;
			}
		},
		search: {
			get() {
				return this.$store.state.pageSearch;
			},
			set(v) {
				this.$store.commit('setPageSearch', v);
			},
		},
	},
	created() {
		setInterval(this.getDateTime, 1000);
	},
	methods: {
		...mapMutations('app', ['setDrawer', 'toggleDrawer']),
		onClick() {
			this.setDrawer(!this.$store.state.app.drawer);
		},
		getDateTime() {
			let event = new Date();
			let options = { year: 'numeric', weekday: 'long', month: 'long', day: 'numeric' };
			this.date = event.toLocaleDateString('en-US', options);
			this.time = this.$moment(new Date()).format('hh:mm:ss');
			this.localTime = this.$moment(new Date()).format('A');
		},
		// onResponsiveInverted() {
		// 	if (window.innerWidth < 991) {
		// 		this.responsive = true;
		// 	} else {
		// 		this.responsive = false;
		// 	}
		// },
	},
};
</script>

<style>
/* Fix coming in v2.0.8 */
#core-app-bar {
	width: auto;
}
#core-app-bar .v-toolbar__content {
	padding: 0 !important;
}
#core-app-bar a {
	text-decoration: none;
}
.search-box {
	border: 1px solid #d8d8d8 !important;
}
.search-box label {
	font-size: 14px !important;
	color: #ababab !important;
}

.v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
	background: #f3f4ff8c !important;
}

.v-text-field--filled.v-input--dense .v-label {
	top: 3px !important;
}
.account-list:hover {
	background: #ed1c24 !important;
}
.search-field .v-input__control .v-input__slot {
	align-items: center !important;
}
</style>
