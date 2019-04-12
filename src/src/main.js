import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false;
Vue.use(VueI18n)

const i18n = new VueI18n({
	fallbackLocale: 'en',
	locale: 'en',
	messages: {
		en: {},
		ru: {}
	},
});

window.i18n = i18n;

new Vue({
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')