<template lang="pug">
	main
		nav.navbar.navbar-dark.bg-dark.mb-4
			ul.nav 
				li.nav-item
					span.navbar-brand.text-white Interactive Menu Builder 
				li.nav-item
					router-link.nav-link.text-white(to="./") {{ $t("Home") }}
				li.nav-item
					span.navbar-text /
				li.nav-item
					router-link.nav-link.text-white(to="./examples") {{ $t("Examples") }} 
				li.nav-item
					span.navbar-text /
				li.nav-item
					router-link.nav-link.text-white(to="./changelog") {{ $t("Changelog") }} 
			div.form-inline
				span.text-white.mr-3 {{ $t("Language") }} 
				select.custom-select(:value = "$cookies.get('lang') || 'en'", @change="update_language")
					option(value="ru") Русский
					option(value="en") English 
		
		// 382 - с navbar
		// 326 - без navbar 
		router-view(style="min-height: calc(100vh - 144px)")

		footer.bg-dark.mt-4.d-flex.text-white.justify-content-between.py-2
			div.px-5
				span.mr-3 (c) AlexTheRegent 
				a(rel="license", href="http://creativecommons.org/licenses/by-nc-sa/4.0/").d-inline
					img(alt="Creative Commons License" style="border-width:0; margin-bottom: 2px" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png")
			div.px-5 v1.0-beta01 
</template>

<script>
export default {
	name: "app",

	created: function() {
		let lang = this.$cookies.get("lang")
		if (!lang) {
			lang = navigator.language || navigator.userLanguage;
			if ( lang.indexOf("ru") === 0 ) {
				lang = 'ru';
			} else {
				lang = 'en';
			}
			this.$cookies.set('lang', lang);
		}

		window.i18n.locale = this.$cookies.get("lang") || "en";
	},

	methods: {
		update_language: function(event) {
			this.$cookies.set('lang', event.target.value);
			this.$router.go();
		}
	}
};
</script>


<i18n>
{
	"en": {
		"Home": "Home",
		"Changelog": "Changelog",
		"Examples": "Examples",
		"Language": "Language"
	},
	"ru": {
		"Home": "В начало",
		"Changelog": "Список изменений",
		"Examples": "Примеры",
		"Language": "Язык"
	}
}
</i18n>

<style>
.tooltip-vue {
	display: block !important;
	z-index: 10000;
}

.tooltip-vue .tooltip-vue-inner {
	background: black;
	color: white;
	border-radius: 16px;
	padding: 5px 10px 4px;
}

.tooltip-vue .tooltip-vue-arrow {
	width: 0;
	height: 0;
	border-style: solid;
	position: absolute;
	margin: 5px;
	border-color: black;
	z-index: 1;
}

.tooltip-vue[x-placement^="top"] {
	margin-bottom: 5px;
}

.tooltip-vue[x-placement^="top"] .tooltip-vue-arrow {
	border-width: 5px 5px 0 5px;
	border-left-color: transparent !important;
	border-right-color: transparent !important;
	border-bottom-color: transparent !important;
	bottom: -5px;
	left: calc(50% - 5px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-vue[x-placement^="bottom"] {
	margin-top: 5px;
}

.tooltip-vue[x-placement^="bottom"] .tooltip-vue-arrow {
	border-width: 0 5px 5px 5px;
	border-left-color: transparent !important;
	border-right-color: transparent !important;
	border-top-color: transparent !important;
	top: -5px;
	left: calc(50% - 5px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-vue[x-placement^="right"] {
	margin-left: 5px;
}

.tooltip-vue[x-placement^="right"] .tooltip-vue-arrow {
	border-width: 5px 5px 5px 0;
	border-left-color: transparent !important;
	border-top-color: transparent !important;
	border-bottom-color: transparent !important;
	left: -5px;
	top: calc(50% - 5px);
	margin-left: 0;
	margin-right: 0;
}

.tooltip-vue[x-placement^="left"] {
	margin-right: 5px;
}

.tooltip-vue[x-placement^="left"] .tooltip-vue-arrow {
	border-width: 5px 0 5px 5px;
	border-top-color: transparent !important;
	border-right-color: transparent !important;
	border-bottom-color: transparent !important;
	right: -5px;
	top: calc(50% - 5px);
	margin-left: 0;
	margin-right: 0;
}

.tooltip-vue.popover .popover-inner {
	background: #f9f9f9;
	color: black;
	padding: 24px;
	border-radius: 5px;
	box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip-vue.popover .popover-arrow {
	border-color: #f9f9f9;
}

.tooltip-vue[aria-hidden="true"] {
	visibility: hidden;
	opacity: 0;
	transition: opacity 0.15s, visibility 0.15s;
}

.tooltip-vue[aria-hidden="false"] {
	visibility: visible;
	opacity: 1;
	transition: opacity 0.15s;
}
</style>
