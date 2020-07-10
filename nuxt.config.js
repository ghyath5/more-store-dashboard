const env = require('dotenv').config();
module.exports = {
	/*
	 ** Headers of the page
	 */
	mode: 'spa',
	env: env.parsed,
	head: {
		title: 'Dashboard',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content: 'More store dashboard',
			},
		],
		link: [
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@500&display=swap' },
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp',
			},
		],
	},
	plugins: [
		'~/plugins/functions.js',
		// '~/plugins/vuetify.js',
		'~/plugins/base.js',
		'~/plugins/components.js',
		'~/plugins/auth.js',
	],
	css: ['~/assets/less/main.less'],
	/*
	 ** Customize the progress bar color
	 */
	loading: { color: '#3B8070' },
	/*
	 ** Build configuration
	 */
	build: {
		extractCSS: true,
		extend(config, ctx) {
			// Run ESLint on save
			// if (ctx.isDev && ctx.isClient) {
			// 	config.module.rules.push({
			// 		enforce: 'pre',
			// 		test: /\.(js|vue)$/,
			// 		loader: 'eslint-loader',
			// 		exclude: /(node_modules)/,
			// 	});
			// }
			if (ctx.isClient) {
				config.devtool = 'source-map';
			}
		},
		// transpile: [/^vuetify/],
	},
	modules: ['@nuxtjs/apollo'],
	apollo: {
		errorHandler: '~/plugins/apollo/error-handler.js',
		includeNodeModules: true,
		clientConfigs: {
			default: '~/plugins/apollo/config.js',
			auth: {
				httpEndpoint: 'https://more-store.herokuapp.com/v1/graphql',
			},
		},
	},
	buildModules: ['@nuxtjs/moment', '@nuxtjs/vuetify'],
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		treeShake: true,
		theme: {
			dark: false,
			themes: {
				light: {
					primary: '#000',
					secondary: '#ed1c24',
				},
			},
		},
		// defaultAssets: false,
		icons: {
			iconfont: 'mdi',
		},
	},
};
