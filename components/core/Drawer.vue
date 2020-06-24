<template>
	<v-navigation-drawer
		id="app-drawer"
		v-model="inputValue"
		app
		:color="'white'"
		light
		floating
		mobile-breakpoint="991"
		persistent
		width="260"
	>
		<!-- <template v-slot:img="attrs"> -->
		<!-- <v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)" /> -->
		<!-- </template> -->

		<v-list-item two-line>
			<v-list-item-avatar color="white">
				<v-img src="https://cdn.vuetifyjs.com/images/logos/v.png" height="34" contain />
			</v-list-item-avatar>

			<v-list-item-title class="title">
				VUETIFY MD
			</v-list-item-title>
		</v-list-item>

		<v-divider class="mx-3 mb-3" />

		<v-list>
			<!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
			<div />
			<template v-for="(item, i) in links">
				<v-list-group v-if="item.children" :key="item.text" v-model="item.model" :prepend-icon="item.icon">
					<template v-slot:activator>
						<v-list-item-title>
							{{ item.text }}
						</v-list-item-title>
					</template>
					<template v-for="(child, i) in item.children">
						<v-list-item
							:key="child.text + i"
							:to="child.to"
							router
							exact
							color="black"
							active-class="primary white--text"
							class="ml-3"
						>
							<v-list-item-action v-if="child.icon">
								<v-icon>{{ child.icon }}</v-icon>
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title>{{ child.text }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list-group>
				<v-list-item v-else :key="i" :to="item.to" color="black" light active-class="primary white--text">
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>

					<v-list-item-title v-text="item.text" />
				</v-list-item>
			</template>
		</v-list>

		<template v-slot:append>
			<v-list nav>
				<v-list-item to="#">
					<v-list-item-action>
						<v-icon>mdi-package-up</v-icon>
					</v-list-item-action>

					<v-list-item-title class="font-weight-light">
						Something else
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex';

export default {
	props: {
		opened: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		links: [
			{
				to: '/',
				icon: 'mdi-view-dashboard',
				text: 'Dashboard',
			},
			{
				to: '/products',
				icon: 'mdi-storefront',
				text: 'Products',
			},
			{
				to: '/categories',
				icon: 'mdi-tab',
				text: 'Categories',
			},
			// {
			// 	to: '/table-list',
			// 	icon: 'mdi-clipboard-outline',
			// 	text: 'Table List',
			// },
			// {
			// 	icon: 'mdi-account',
			// 	text: 'Users',
			// 	model: false,
			// 	children: [
			// 		{ icon: 'list', text: 'Clients', to: '/users/clients' },
			// 		{
			// 			icon: 'mdi-tab',
			// 			text: 'Categories',
			// 			to: '/partsCategories',
			// 		},
			// 		{ icon: 'list', text: 'Vendors', to: '/vendors' },
			// 		{ icon: 'list', text: 'Recent Builds', to: '/recentBuilds' },
			// 	],
			// },
			// {
			// 	to: '/notifications',
			// 	icon: 'mdi-bell',
			// 	text: 'Notifications',
			// },
		],
	}),

	computed: {
		...mapState('app', ['image', 'color']),
		inputValue: {
			get() {
				return this.$store.state.app.drawer;
			},
			set(val) {
				this.setDrawer(val);
			},
		},
	},

	methods: {
		...mapMutations('app', ['setDrawer', 'toggleDrawer']),
	},
};
</script>
