<template lang="pug">
	div.container
		h1 {{ $t('Settings') }} 
		table.table.table-sm.text-center
			thead
				tr 
					th {{ $t('Parameter') }} 
					th {{ $t('Value') }} 
			tbody 
				tr 
					td {{ $t('Game') }} 
					td 
						input#game-csgo.ml-3(name="menu-type", type="radio", value="csgo", v-model="game") 
						label.mr-3.ml-2.form-check-label(for="game-csgo") CS:GO 
						input#game-css(name="menu-type", type="radio", value="css", v-model="game") 
						label.mr-3.ml-2.form-check-label(for="game-css") CS:S 

		h1 {{ $t('Menus') }}
		table.table.shadow
			thead.thead-light
				tr.text-center
					th #
					th {{ $t('Name') }} 
					th {{ $t('Actions') }} 
			tbody 
				tr.text-center(v-for="menu, index in menus")
					th(scope="row") {{ index + 1 }}
					td {{ menu }}
					td 
						button(@click="delete_menu(menu)").btn.btn-sm.btn-danger.mr-3 {{ $t('Delete') }}  
						button(@click="edit_menu(menu)").btn.btn-sm.btn-primary.w-25 {{ $t('Edit') }} 
				tr.text-center
					td 
					td 
					td 
						button.btn.btn-primary.mx-auto.w-25(@click="create_menu") {{ $t('Add') }} 

		div.d-flex.justify-content-around.mt-3
			button(@click="start_import").btn.btn-lg.btn-secondary.w-25 {{ $t('ImportJSON') }} 
			button(@click="export_json").btn.btn-lg.btn-secondary.w-25 {{ $t('ExportJSON') }} 
			button(@click="$router.push('/generate')").btn.btn-lg.btn-info.w-25 {{ $t('Generate') }} 
		
		input.d-none(type="file", @change="import_json", ref="importer")
			
</template>

<i18n>
{
	"en": {
		"Settings": "Settings",
		"Parameter": "Parameter",
		"Value": "Value",
		"Game": "Game",
		"Menus": "Menus",
		"Name": "Name",
		"Actions": "Actions",
		"Delete": "Delete",
		"Edit": "Edit",
		"ImportJSON": "Import JSON",
		"ExportJSON": "Export JSON",
		"Generate": "Generate plugin",
		"Attention": "Attention",
		"Confirm": "Confirm action",
		"Cancel": "Cancel",
		"Add": "Add new"
	},
	"ru": {
		"Settings": "Настройки",
		"Parameter": "Параметр",
		"Value": "Значение",
		"Game": "Игра",
		"Menus": "Меню",
		"Name": "Название",
		"Actions": "Действия",
		"Delete": "Удалить",
		"Edit": "Редактировать",
		"ImportJSON": "Импортировать JSON",
		"ExportJSON": "Экспортировать JSON",
		"Generate": "Сгенерировать плагин",
		"Attention": "Внимание",
		"Confirm": "Подтвердите удаление меню",
		"Cancel": "Отмена",
		"Add": "Добавить новое"
	}
}
</i18n>

<script>
export default {
	name: "index",

	data: function() {
		return {
			game: "csgo",
			menus: []
		};
	},

	created: function() {
		let key;
		let prefix = "_menubuilder_";
		for (let i = 0; i < localStorage.length; ++i) {
			key = localStorage.key(i);
			if (key.startsWith(prefix)) {
				this.menus.push(key.substr(prefix.length));
			}
		}

		this.game = localStorage.getItem("game") || "csgo";
	},

	methods: {
		create_menu: function() {
			localStorage.setItem("name", "");
			this.$router.push("edit");
		},

		edit_menu: function(menu) {
			localStorage.setItem("name", menu);
			this.$router.push("edit");
		},

		delete_menu: function(menu) {
			this.$swal({
				title: this.$t('Attention'),
				text: this.$t('Confirm'),
				icon: "warning",
				buttons: [this.$t('Cancel'), this.$t('Delete')],
				dangerMode: true
			}).then(value => {
				if (value === true) {
					localStorage.removeItem("_menubuilder_" + menu);
					this.menus.splice(this.menus.indexOf(menu), 1);
				}
			});
		},

		start_import: function() {
			this.$refs.importer.click();
		},

		import_json: function(event) {
			let reader = new FileReader();
			reader.onload = () => {
				let data = JSON.parse(reader.result);
				for (let key of Object.keys(data)) {
					localStorage.setItem("_menubuilder_" + key, data[key]);
					if (this.menus.indexOf(key) === -1) {
						this.menus.push(key);
					}
				}
			};

			reader.readAsText(event.target.files[0]);
		},

		export_json: function() {
			let key,
				output = {};
			let prefix = "_menubuilder_";
			for (let i = 0; i < localStorage.length; ++i) {
				key = localStorage.key(i);
				if (key.startsWith(prefix)) {
					output[key.substr(prefix.length)] = localStorage.getItem(
						key
					);
				}
			}

			this.save_file("menubuild.json", JSON.stringify(output));
		},

		save_file: function(filename, text) {
			let element = document.createElement("a");
			element.setAttribute(
				"href",
				"data:text/plain;charset=utf-8," + encodeURIComponent(text)
			);
			element.setAttribute("download", filename);

			element.style.display = "none";
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}
	},

	beforeRouteLeave: function(to, from, next) {
		localStorage.setItem("game", this.game);
		next();
	}
};
</script>

<style>
</style>
