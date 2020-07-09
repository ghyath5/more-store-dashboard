<template>
	<v-navigation-drawer
		id="app-drawer"
		v-model="inputValue"
		app
		clipped
		:color="'white'"
		light
		floating
		mobile-breakpoint="991"
		persistent
		width="240"
	>
		<!-- <template v-slot:img="attrs"> -->
		<!-- <v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)" /> -->
		<!-- </template> -->

		<!-- <v-list-item two-line>
			
		</v-list-item> -->

		<!-- <v-divider class="mx-3 mb-3" /> -->

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
							active-class="secondary white--text"
							class="ml-3"
						>
							<v-list-item-action v-if="child.icon">
								<v-icon>{{ child.icon }}</v-icon>
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title>{{ child.text }}</v-list-item-title>
								<v-list-item-subtitle>{{ child.subtitle }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list-group>
				<v-list-item v-else :key="i" :to="item.to" color="black" light active-class="secondary white--text">
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
	data: () => ({}),

	computed: {
		...mapState('app', ['image', 'color']),
		links() {
			let links = [
				{
					to: '/',
					icon: 'mdi-view-dashboard',
					text: 'Dashboard',
				},
				this.$has_permission('read_products') && {
					to: '/products',
					icon: 'mdi-storefront',
					text: 'Products',
				},
				this.$has_permission('read_categories') && {
					to: '/categories',
					icon: 'mdi-tab',
					text: 'Categories',
				},
				this.$has_permission('read_orders') && {
					// to: '/orders',
					icon: 'mdi-package-variant-closed',
					text: 'Orders',
					model: false,
					children: [
						{
							icon: 'view_list',
							text: 'All orders',
							to: '/orders',
						},
						{
							icon: 'mdi-package-variant',
							text: 'Non-assigned orders',
							to: '/orders?status=not-assigned',
							subtitle: 'Orders those ',
						},
						{
							icon: 'mdi-truck-check-outline',
							text: 'Delivered orders',
							to: '/orders?status=delivered',
						},
					].filter(e => e),
				},
				// {
				// 	to: '/table-list',
				// 	icon: 'mdi-clipboard-outline',
				// 	text: 'Table List',
				// },
				{
					icon: 'mdi-folder-open',
					text: 'Settings',
					model: false,
					children: [
						this.$has_permission('read_users') && {
							icon: 'mdi-account-supervisor',
							text: 'Users',
							to: '/settings/users',
						},
						this.$has_permission('manage_roles') && {
							icon: 'mdi-security',
							text: 'Permission',
							to: '/settings/permissions',
						},
						this.$has_permission('manage_roles') && {
							icon: 'mdi-sitemap',
							text: 'Roles',
							to: '/settings/roles',
						},
					].filter(e => e),
				},
			];
			return links.filter(e => e);
		},
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
