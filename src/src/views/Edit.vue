<template lang="pug">
	div.container
		h1 {{ $t("Parameters") }} 

		table.table.table-sm
			tbody 
				tr
					td.align-middle
						label.mr-3 {{ $t("Name") }} 
					td 
						input.form-control(type="text", :placeholder="$t('ExampleName')", size="32", v-model="name", @input="name = name.replace(/[^a-zA-Z]/g, '')")
				tr
					td.align-middle
						label.mr-3 {{ $t("Command") }} 
					td 
						div.input-group
							input.form-control(type="text", :placeholder="$t('ExampleCommand')", size="32", v-model="command")
							div.input-group-append
								select#flags(multiple, :title="$t('AccessFlags')", @change="update_flags")
									option(value="ADMFLAG_RESERVATION") a
									option(value="ADMFLAG_GENERIC") b
									option(value="ADMFLAG_KICK") c
									option(value="ADMFLAG_BAN") d
									option(value="ADMFLAG_UNBAN") e
									option(value="ADMFLAG_SLAY") f
									option(value="ADMFLAG_CHANGEMAP") g
									option(value="ADMFLAG_CONVARS") h
									option(value="ADMFLAG_CONFIG") i
									option(value="ADMFLAG_CHAT") j
									option(value="ADMFLAG_VOTE") k
									option(value="ADMFLAG_PASSWORD") l
									option(value="ADMFLAG_RCON") m
									option(value="ADMFLAG_CHEATS") n
									option(value="ADMFLAG_ROOT") z
									option(value="ADMFLAG_CUSTOM1") o
									option(value="ADMFLAG_CUSTOM2") p
									option(value="ADMFLAG_CUSTOM3") q
									option(value="ADMFLAG_CUSTOM4") r
									option(value="ADMFLAG_CUSTOM5") s
									option(value="ADMFLAG_CUSTOM6") t
				tr
					td.align-middle
						label.mr-3.form-check-label {{ $t("Type") }} 
					td 
						input#type-menu.ml-3(name="menu-type", type="radio", value="menu", v-model="type", @change="sort_items") 
						label.mr-3.ml-2.form-check-label(for="type-menu") {{ $t("MenuType") }}  
						input#type-panel(name="menu-type", type="radio", value="panel", v-model="type", @change="sort_items") 
						label.mr-3.ml-2.form-check-label(for="type-panel") {{ $t("PanelType") }}  
				tr(v-if="type==='menu'")
					td.align-middle
						label.mr-3 {{ $t("ExitBack") }} 
					td
						// input.form-control(type="text", :placeholder="$t('ExampleExitBack')", size="32", v-model="exit_back", @input="exit_back = exit_back.replace(/[^a-zA-Z]/g, '')")
						// div.d-flex
						// 	select.w-100(data-live-search="true", v-model="exit_back", :title="$t('ExampleExitBack')")
						// 		option(v-for="menu_name in menu_names", :value="menu_name") {{ menu_name }}
						// 		option(v-if="exit_back.length && menu_names.indexOf(exit_back) === -1") {{ exit_back }}
						// 	button.btn.btn-secondary(@click="exit_back = ''; refresh_select('#exit-back')", data-toggle="tooltip", data-placement="top", :title="$t('Delete')") X
						LiveSearch(v-bind:title="$t('ExampleExitBack')", v-bind:menu_names="menu_names", v-model="exit_back")
						

		h1 {{ $t("Content") }} 
		div.row
			div.col-xl-7
				h2.text-center {{ $t("Menu") }}  
				div.row.mb-4
					div.input-group
						div.input-group-prepend
							span.input-group-text {{ $t("Title") }}   
						input#menu-title.form-control(type="text", :placeholder="$t('ExampleTitle')", v-model="title")
				
				div.mb-3(v-for="item of items")
					div.row
						div.input-group
							div.input-group-prepend
								span(v-if="type==='menu'").input-group-text {{ item.position }}
								select(v-else, v-model:value="item.position", @change="sort_items").input-group-text
									option(value=" ") 
									option(v-for="value in 9" :value="value") {{ value }}
									option(value="0") 0
							input.form-control(type="text", :placeholder="$t('ExampleItem')", v-model="item.text")
							div.input-group-append
								button.btn.btn-secondary(@click="delete_item(item)", data-toggle="tooltip", data-placement="top", :title="$t('Delete')") X

					div.row
						div.input-group(v-for="action of item.actions")
							div.input-group-prepend
								span.input-group-text(v-if="action.action === 'open'") {{ $t("OpenMenu") }} 
								span.input-group-text(v-if="action.action === 'pcmd'") {{ $t("ClientCommand") }} 
								span.input-group-text(v-if="action.action === 'scmd'") {{ $t("ServerCommand") }} 
								span.input-group-text(v-if="action.action === 'close'") {{ $t("CloseMenu") }} 

							// input.form-control(v-if="action.action === 'open'", type="text", :placeholder="$t('ExampleOpenMenu')", v-model="action.target", @input="action.target = action.target.replace(/[^a-zA-Z]/g, '')", v-on:load="dump")
							LiveSearch(v-if="action.action === 'open'", v-bind:title="$t('ExampleOpenMenu')", v-bind:menu_names="menu_names", v-model="action.target")
							input.form-control(v-if="action.action === 'pcmd'", type="text", :placeholder="$t('ExampleClientCommand')", v-model="action.target")
							input.form-control(v-if="action.action === 'scmd'", type="text", :placeholder="$t('ExampleServerCommand')", v-model="action.target")
							input.form-control(v-if="action.action === 'close'", type="text", placeholder="", v-model="action.target", disabled)

							div.input-group-append
								button.btn.btn-secondary(@click="delete_action(item, action)", data-toggle="tooltip", data-placement="top", :title="$t('Delete')") X

						div.mt-1.mx-auto
							button.btn.btn-outline-secondary.btn-sm(type="button", data-toggle="dropdown", aria-haspopup="true", aria-expanded="false") {{ $t("AddAction") }} 
							div.dropdown-menu
								button.dropdown-item(@click="add_action(item, 'open')") {{ $t("OpenMenu") }} 
								button.dropdown-item(@click="add_action(item, 'pcmd')") {{ $t("ClientCommand") }} 
								button.dropdown-item(@click="add_action(item, 'scmd')") {{ $t("ServerCommand") }} 
								button.dropdown-item(@click="add_action(item, 'close')") {{ $t("CloseMenu") }} 
				
				div.row.mb-3
					div.mx-auto
						button.btn.btn-outline-secondary.mt-3(@click="add_item") {{ $t("AddItem") }} 
			
			div.col-xl

			div.col-xl-4
				h2.text-center {{ $t("Preview") }} 
				div#preview.mb-4.shadow-lg(v-for="i in Math.ceil(items.length / items_per_page)")
					div.overflow-hidden
						div.raw-html {{ process_text(title) }}

					div.overflow-hidden(v-for="item in items.slice((i - 1) * items_per_page, i * items_per_page)")
						// div.raw-html(v-if="type==='menu'" v-bind:class="{'item-muted': item.actions.length === 0}") {{ ((item.position - 1) % items_per_page) + 1 }}. {{ process_text(item.text) }}
						// div.raw-html(v-else)
						// 	span(v-if="item.position !== ' '" v-bind:class="{'item-muted': item.actions.length === 0}") {{ item.position }}. 
						// 	span(v-bind:class="{'item-muted': (item.actions.length === 0 || item.position === ' ')}") {{ process_text(item.text) }}
						
						div(v-if="type==='menu'")
							div.raw-html(v-for="key, value in item.text.split('\\\\n')", v-bind:class="{'item-active': item.actions.length !== 0 && value === 0}") {{ value === 0 ? ((((item.position - 1) % items_per_page) + 1) + '. ') : '' }}{{ key }}
						div(v-else)
							div.raw-html(v-for="key, value in item.text.split('\\\\n')", v-bind:class="{'item-active': item.actions.length !== 0 && value === 0 && item.position !== ' '}") {{ value === 0 ? ((((item.position - 1) % items_per_page) + 1) + '. ') : '' }}{{ key }}
					
					// Back, Forward, Exit buttons 
					div(v-if="type === 'menu'")
						div(v-if="i > 1 || exit_back !== ''")
							div &nbsp;
							div {{ items_per_page + 1}}. {{ $t("Back") }} 
							div(v-if="items.length / items_per_page > i")
								div {{ items_per_page + 2}}. {{ $t("Forward") }} 
						div(v-else)
							div &nbsp;
							div(v-if="items.length / items_per_page > i")
								div {{ items_per_page + 2}}. {{ $t("Forward") }} 

						div {{ (items_per_page === 6) ? 9 : 0}}. {{ $t("Exit") }} 
		
		div.d-xl-flex.justify-content-end.text-center
			div.my-auto.d-inline
				button.btn.btn-sm.btn-danger.mr-3(@click="delete_menu") {{ $t("DeleteMenu") }} 
			button.btn.btn-lg.btn-warning.mr-3(@click="go_back") {{ $t("GoBack") }} 
			button.btn.btn-lg.btn-primary(@click="save_menu") {{ $t("Save") }} 
</template>

<i18n>
{
	"en": {
		"Parameters": "Parameters",
		"Name": "Unique menu mane:",
		"ExampleName": "Example: main (only letters!)",
		"Command": "Command to open menu:",
		"ExampleCommand": "Example: sm_main",
		"AccessFlags": "Access flags",
		"Type": "Type:",
		"MenuType": "Menu",
		"PanelType": "Panel",
		"ExitBack": "Exit in menu will open menu:",
		"ExampleExitBack": "Optionally, unique menu name",
		"Content": "Content",
		"Menu": "Menu",
		"Title": "Title",
		"ExampleTitle": "Title text",
		"Preview": "Preview",
		"AddItem": "Add item",
		"ExampleItem": "Text to display",
		"AddAction": "Add action",
		"OpenMenu": "Open menu",
		"ExampleOpenMenu": "Unique menu name",
		"ClientCommand": "Client command",
		"ExampleClientCommand": "Command to execute from client",
		"ServerCommand": "Server command",
		"ExampleServerCommand": "Command to execute from server",
		"CloseMenu": "Close menu",
		"Back": "Back",
		"Forward": "Forward",
		"Exit": "Exit",
		"Delete": "Delete",
		"DeleteMenu": "Delete menu",
		"Attention": "Attention",
		"Confirm": "Confirm deletion",
		"ConfirmBack": "You did not saved changes",
		"Cancel": "Cancel",
		"GoBack": "Back",
		"DoNotSave": "Do not save",
		"Save": "Save menu"
	},
	"ru": {
		"Parameters": "Параметры меню",
		"Name": "Уникальное название меню:",
		"ExampleName": "Пример: main (только англ буквы!)",
		"Command": "Команда открытия меню:",
		"ExampleCommand": "Пример: sm_main",
		"AccessFlags": "Флаги доступа",
		"Type": "Тип:",
		"MenuType": "Меню",
		"PanelType": "Панель",
		"ExitBack": "\"Назад\" возвращает в меню:",
		"ExampleExitBack": "Опционально, уникальное название меню",
		"Content": "Содержимое меню",
		"Menu": "Меню",
		"Title": "Заголовок",
		"ExampleTitle": "Текст заголовка",
		"Preview": "Предпросмотр",
		"AddItem": "Добавить пункт",
		"ExampleItem": "Отображаемый текст",
		"AddAction": "Добавить действие",
		"OpenMenu": "Открыть меню",
		"ExampleOpenMenu": "Уникальное название меню",
		"ClientCommand": "Команда от игрока",
		"ExampleClientCommand": "Команда для выполнения игроком",
		"ServerCommand": "Команда от сервера",
		"ExampleServerCommand": "Команда для выполнения сервером",
		"CloseMenu": "Закрыть меню",
		"Back": "Назад",
		"Forward": "Вперёд",
		"Exit": "Выход",
		"Delete": "Удалить",
		"DeleteMenu": "Удалить меню",
		"Attention": "Внимание",
		"Confirm": "Подтвердите удаление меню",
		"ConfirmBack": "Вы не сохранили изменения",
		"Cancel": "Отмена",
		"GoBack": "Назад",
		"DoNotSave": "Не сохранять",
		"Save": "Сохранить меню"
	}
}
</i18n>

<style>
#preview {
	border-radius: 10px;
	padding: 10px 20px;
	background-color: #666;
	color: #e6e1c3;
	font-size: 18pt;
}

.item-active:first-child {
	color: #dda627;
}

.overflow-hidden {
	overflow: hidden;
}

.raw-html {
	white-space: pre-wrap;
}

.btn.dropdown-toggle.btn-light {
	border: 1px solid #ccc;
}
</style>

<script>
import LiveSearch from '../components/LiveSearch.vue';

export default {
	name: "edit",

	components: {
		LiveSearch
	},

	data: function() {
		return {
			// name: "main",
			// title: "Добро пожаловать\\nна супер сервер",
			// items: [
			// 	{
			// 		position: 1,
			// 		text: "Полезные команды",
			// 		actions: [{ action: "open", target: "commands" }]
			// 	},
			// 	{
			// 		position: 2,
			// 		text: "Правила сервера",
			// 		actions: [{ action: "open", target: "rules" }]
			// 	},
			// 	{
			// 		position: 3,
			// 		text: "О сервере",
			// 		actions: [{ action: "open", target: "about" }]
			// 	},
			// 	{
			// 		position: 4,
			// 		text: "Контакты",
			// 		actions: [{ action: "open", target: "contacts" }]
			// 	}
			// ],

			name: "",
			base_name: "",
			title: "",
			items: [{ position: 1, text: "", actions: [] }],
			items_per_page: 7,
			type: "menu",
			exit_back: "",
			command: "",
			flags: [],
			menu_names: []
		};
	},

	created: function() {
		$(function() {
			$('[data-toggle="tooltip"]').tooltip();
		});

		this.base_name = this.name = localStorage.getItem("name");
		if (this.name.length > 0) {
			let proxy = JSON.parse(
				localStorage.getItem("_menubuilder_" + this.name)
			);
			this.title = proxy.title;
			this.items = proxy.items;
			this.type = proxy.type;
			this.command = proxy.command;
			this.exit_back = proxy.exit_back;
			this.flags = proxy.flags ? proxy.flags.split("|") : [];
		}

		let game = localStorage.getItem("game") || "csgo";
		this.items_per_page = game === "csgo" ? 6 : 7;

		this.menu_names = [];
		let key;
		let prefix = "_menubuilder_";
		for (let i = 0; i < localStorage.length; ++i) {
			key = localStorage.key(i);
			if (key.startsWith(prefix)) {
				this.menu_names.push(key.substr(prefix.length));
			}
		}
	},

	mounted: function() {
		$("#flags").selectpicker();
		$("#flags").selectpicker("val", this.flags);

		// let wrapSelect = selector => {
		// 	let mute = false;
		// 	$(`${selector} select`).selectpicker({
		// 		noneSelectedText: "none"
		// 	});
		// 	$(`${selector} button[type='button']`).on("click", () => {
		// 		if ($(`${selector} select option.ctf`).length) {
		// 			$(`${selector} select option.ctf`).remove();
		// 			$(`${selector} select`).selectpicker("refresh");
		// 		}
		// 	});

		// 	$(`${selector} .bs-searchbox input`).on("input", () => {
		// 		if (mute) {
		// 			mute = false;
		// 			return;
		// 		}

		// 		let value = $(`${selector} .bs-searchbox input`)[0].value;
		// 		if ($(`${selector} select option.ctf`).length) {
		// 			$(`${selector} select option.ctf`)[0].text = value;
		// 		} else {
		// 			$(`${selector} select`).append(
		// 				$('<option class="ctf">', {
		// 					value: value,
		// 					text: value
		// 				})
		// 			);
		// 		}

		// 		mute = true;
		// 		$(`${selector} select`).selectpicker("refresh");
		// 		$(`${selector} .bs-searchbox input`).trigger("input");
		// 	});
		// };

		// wrapSelect("#exit-back");
	},

	methods: {
		dump: function() {
			console.log('hi')
		},

		refresh_select: function(selector) {
			$(`${selector} select`).selectpicker("val", "");
			$(`${selector} select`).selectpicker("refresh");
		},

		add_item: function() {
			this.items.push({
				position: this.items.length + 1,
				text: "",
				actions: []
			});
		},

		delete_item: function(item) {
			let item_index = this.items.indexOf(item);
			this.items.splice(item_index, 1);

			for (item_index in this.items) {
				this.items[item_index].position = Number(item_index) + 1;
			}
		},

		add_action: function(item, action) {
			let item_index = this.items.indexOf(item);
			this.items[item_index].actions.push({ action, target: "" });
		},

		delete_action: function(item, action) {
			let item_index = this.items.indexOf(item);
			let action_index = this.items[item_index].actions.indexOf(action);
			this.items[item_index].actions.splice(action_index, 1);
		},

		process_text: function(text) {
			return text.replace(/\\n/g, "\n");
		},

		save_menu: function() {
			if (this.base_name !== this.name && this.base_name.length > 0) {
				localStorage.removeItem("_menubuilder_" + this.base_name);
			}
			localStorage.setItem(
				"_menubuilder_" + this.name,
				JSON.stringify({
					title: this.title,
					items: this.items,
					type: this.type,
					command: this.command,
					exit_back: this.exit_back,
					flags: this.flags.join("|")
				})
			);
			this.$router.push("/");

			// if (typeof window.localStorage !== "undefined") {
			//
			// } else {
			// 	let menus = this.$cookies.get("menus");
			// 	if (menus === null) {
			// 		menus = {};
			// 	}

			// 	menus[this.name] = proxy;
			// 	this.$cookies.set("menus", JSON.stringify(menus));
			// }
		},

		delete_menu: function() {
			this.$swal({
				title: this.$t("Attention"),
				text: this.$t("Confirm"),
				icon: "warning",
				buttons: [this.$t("Cancel"), this.$t("Back")],
				dangerMode: true
			}).then(value => {
				if (value === true) {
					localStorage.removeItem("_menubuilder_" + this.base_name);
					this.$router.push("/");
				}
			});
		},

		sort_items: function() {
			if (this.type === "panel") {
				let position = 0;
				for (let i = 0; i < this.items.length; ++i) {
					if (this.items[i].position !== " ") {
						if (this.items[i].position == 0) {
							this.items[i].position = 100;
						}
						if (this.items[i].position > position) {
							position = this.items[i].position;
						} else if (this.items[i].position === position) {
							this.items[i].position++;
							position = this.items[i].position;
						} else {
							position++;
							this.items[i].position = position;
						}
						if (this.items[i].position == 100) {
							this.items[i].position = 0;
						}
					}
				}
			} else {
				for (let i = 0; i < this.items.length; ++i) {
					this.items[i].position = i + 1;
				}
			}
		},

		go_back: function() {
			let old = localStorage.getItem("_menubuilder_" + this.name);
			if (old) {
				let newobj = JSON.stringify({
					title: this.title,
					items: this.items,
					type: this.type,
					command: this.command,
					exit_back: this.exit_back,
					flags: this.flags.join("|")
				});

				if (old !== newobj) {
					this.$swal({
						title: this.$t("Attention"),
						text: this.$t("ConfirmBack"),
						icon: "warning",
						buttons: [this.$t("GoBack"), this.$t("DoNotSave")],
						dangerMode: true
					}).then(value => {
						if (value === true) {
							this.$router.push("/");
						}
					});
				} else {
					this.$router.push("/");
				}
			} else {
				this.$router.push("/");
			}
		},

		update_flags: function() {
			this.flags = $("#flags").val();
		}
	},

	beforeRouteLeave: function(to, from, next) {
		next();
	}
};
</script>
