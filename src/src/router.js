import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import Index from './views/Index.vue'
import Edit from './views/Edit.vue'
import Generate from './views/Generate.vue'
import Changelog from './views/Changelog.vue'
import Examples from './views/Examples.vue'
import VTooltip from 'v-tooltip'
import VueSwal from 'vue-swal'

Vue.use(Router);
Vue.use(VueCookies);
Vue.use(VTooltip, {
	defaultTemplate: '<div class="tooltip-vue" role="tooltip"><div class="tooltip-vue-arrow"></div><div class="tooltip-vue-inner"></div></div>',
	defaultArrowSelector: '.tooltip-vue-arrow, .tooltip-vue__arrow',
	defaultInnerSelector: '.tooltip-vue-inner, .tooltip-vue__inner',
	popover: {
		defaultBaseClass: 'tooltip-vue popover-vue',
		defaultInnerClass: 'tooltip-vue-inner popover-inner',
		defaultArrowClass: 'tooltip-vue-arrow popover-arrow',
	}
});
Vue.use(VueSwal);

VueCookies.config('7d')

export default new Router({
	routes: [{
			path: '/',
			name: 'index',
			component: Index
		},
		{
			path: '/edit',
			name: 'edit',
			component: Edit
		},
		{
			path: '/generate',
			name: 'generate',
			component: Generate
		},
		{
			path: '/changelog',
			name: 'changelog',
			component: Changelog
		},
		{
			path: '/examples',
			name: 'examples',
			component: Examples
		}
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (about.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		// }
	]
})