import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default ctx => {
	const vuetify = new Vuetify({
		theme: {
			themes: {
				light: {
					primary: '#000',
					secondary: '#ed1c24',
				},
			},
		},
		icons: {
			iconfont: 'mdi',
		},
	});

	ctx.app.vuetify = vuetify;
	ctx.$vuetify = vuetify.framework;
};
