<template lang="pug">
	div.d-flex.flex-grow-1(ref="div")
		select.w-100(data-live-search="true", :value="value", :title="title", ref="select", @change="update_select").w-100
			option(v-for="menu_name in menu_names", :value="menu_name") {{ menu_name }}
			option(v-if="value.length && menu_names.indexOf(value) === -1") {{ value }}
		button.btn.btn-secondary(@click="reset_select", data-toggle="tooltip", data-placement="top", :title="$t('Reset')", ref="button", style="padding: 0.17rem 0.5rem") &#10226;
</template>

<script>
export default {
	name: "live-search",

	props: ["value", "title", "menu_names"],

	data: function() {
		return {};
	},

	mounted: function() {
		let mute = false;
		$(this.$refs.select).selectpicker();
		$(this.$refs.select).selectpicker("val", this.value);

		let input = $(this.$refs.div)
			.find(".bs-searchbox")
			.find("input");

		input.on("input", () => {
			if (mute) {
				mute = false;
				return;
			}

			let value = input[0].value.replace(/[^a-zA-Z]/g, '');
			input[0].value = value;

			if ($(this.$refs.select).find("option.ctf").length) {
				$(this.$refs.select).find("option.ctf")[0].value = value;
				$(this.$refs.select).find("option.ctf")[0].text = value;
			} else {
				$(this.$refs.select).append(
					$('<option class="ctf">', {
						value: value,
						text: value
					})
				);
			}

			mute = true;
			$(this.$refs.select).selectpicker("refresh");
			input.trigger("input");
		});
	},

	methods: {
		refresh: function() {
			$(this.$refs.select).selectpicker("refresh");
		},

		update_select: function() {
			this.$emit("input", this.$refs.select.value);
		},

		reset_select: function() {
			$(this.$refs.select).selectpicker("val", "");
			this.update_select();
		}
	}
};
</script> 

<i18n>
{
	"en": {
		"Reset": "Reset"
	},
	"ru": {
		"Reset": "Сбросить"
	}
}
</i18n>
