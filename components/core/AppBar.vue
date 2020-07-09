<template>
	<v-app-bar short fixed clipped-left id="core-app-bar" app color="white" flat height="50">
		<v-row dense align="center">
			<v-col style="max-width:240px" xl="2" sm="2" lg="2" md="2" class="hidden-sm-and-down">
				<v-img class="ma-auto" src="/logo.png" height="50" width="80" contain />
			</v-col>
			<v-col md="8" sm="10">
				<v-row dense align="center">
					<v-col sm="1">
						<v-btn light icon @click.stop="onClick">
								<v-icon>mdi-view-list</v-icon>
						</v-btn>
					</v-col>
					<v-col sm="5">
						<v-text-field
							class="search-box"
							label="Search"
							v-model="search"
							hide-details
							rounded
							dense
							filled
							single-line
						>
							<template v-slot:prepend-inner>
								<div style="margin-top:-5px">
									<v-icon size="20" color="#ababab">
										search
									</v-icon>
								</div>
							</template>
						</v-text-field>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- <v-row dense justify="left"  align="center">
			<v-col sm="10" class="text-center">
				
			</v-col>
		</v-row> -->
		<!-- <v-spacer /> -->

		<!-- <v-toolbar-items>
			<v-row dense align="center" >
				<v-btn v-if="responsive" light icon @click.stop="onClick">
						<v-icon>mdi-view-list</v-icon>
				</v-btn>
				<v-col sm="10">
					<v-text-field
						class="search-box"
						label="Search"
						v-model="search"
						hide-details
						rounded
						dense
						filled
						single-line
					>
						<template v-slot:prepend-inner>
							<div style="margin-top:-5px">
								<v-icon size="20" color="#ababab">
									search
								</v-icon>
							</div>
						</template>
					</v-text-field>
				</v-col>
			</v-row>
		</v-toolbar-items> -->
		<!-- <v-spacer /> -->
		<v-toolbar-items>
			<v-row align="center" class="mx-0">
				<v-menu bottom left offset-y transition="slide-y-transition">
					<template v-slot:activator="{ attrs, on }">
						<v-btn small class="toolbar-items mr-4" icon v-bind="attrs" v-on="on">
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

				<v-menu bottom left offset-y >
					<template v-slot:activator="{ on }">
						<v-btn class="pl-1 pt-0" elevation x-small rounded outlined  v-on="on">
							<v-icon size="19">mdi-chevron-down</v-icon>
							{{$store.state.me.name}}
						</v-btn>
					</template>
					<v-card>
						<v-list dense>
							<v-hover
								v-slot:default="{ hover }"
							>
							<v-list-item dense class="pointer account-list" :class="{'secondary':hover}" v-for="accountList in accountLists" :key="accountList.text">
								<nuxt-link style="text-decoration:none" :to="accountList.to">
									<v-list-item-title :class="{'white--text':hover}" v-text="accountList.text" />
								</nuxt-link>
							</v-list-item>
							</v-hover>
							<v-divider />
							<v-hover
								v-slot:default="{ hover }"
							>
								<v-list-item @click="$LOGOUT()" dense class="pointer account-list" :class="{'secondary':hover}">
										<v-list-item-title :class="{'white--text':hover}">Logout</v-list-item-title>
								</v-list-item>
							</v-hover>
						</v-list>
					</v-card>
				</v-menu>
				<v-btn small icon class="mr-5">
					<v-icon color="tertiary">
						mdi-account-outline
					</v-icon>
				</v-btn>
			</v-row>
		</v-toolbar-items>
	</v-app-bar>
</template>

<script>
// Utilities
import { mapMutations } from 'vuex';

export default {
	data: () => ({
		accountLists:[
			{
				text:'My account',
				to:'/me'
			}
		],
		notifications: [
			'Mike, John responded to your email',
			'You have 5 new tasks',
			"You're now a friend with Andrew",
			'Another Notification',
			'Another One',
		],
		title: null,
		responsive: true,
		monthNames:["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
		]
	}),

	watch: {
		// $route(val) {
		// 	this.title = val.name;
		// },
	},
	computed: {
		search: {
			get() {
				return this.$store.state.search;
			},
			set(v) {
				this.$store.commit('setSearch', v);
			},
		},
		dateWithTime(){
			let event = new Date();

			let options = {  year: 'numeric', month: 'long', day: 'numeric' };

			return event.toLocaleDateString('en-US', options)
		}
	},
	mounted() {
		// this.onResponsiveInverted();
		// window.addEventListener('resize', this.onResponsiveInverted);
	},
	beforeDestroy() {
		// window.removeEventListener('resize', this.onResponsiveInverted);
	},

	methods: {
		...mapMutations('app', ['setDrawer', 'toggleDrawer']),
		onClick() {
			this.setDrawer(!this.$store.state.app.drawer);
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

#core-app-bar a {
	text-decoration: none;
}
.search-box{
	border: 1px solid #d8d8d8 !important;
}
.search-box label {
	font-size:12px !important;
	color:#ababab !important
}
.v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot { 
	min-height: 26px;
	background:#f3f4ff8c !important;
	display: flex !important;
	align-items: center !important;
	padding-left:5px !important
}
.v-text-field--filled.v-input--dense .v-label{
	top:3px !important
} 
.account-list:hover{
	background:#ed1c24 !important
}
/* 
 .v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
    
  } */
</style>
