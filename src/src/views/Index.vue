<template lang="pug">
	div.container
		div.row
			div.col-3.mr-5
				h1 {{ $t('Settings') }} 
				table.table.table-sm.text-center
					thead
						tr 
							th {{ $t('Parameter') }}
							th {{ $t('Value') }}
					tbody 
						tr 
							td.align-middle {{ $t('Game') }} 
							td
								select.custom-select.py-0.h-100(v-model.number="items_per_page")
									option(value="6") CS:GO
									option(value="7") CS:S

				h1 {{ $t('Menus') }}
				table.table.table-hover.table-bordered
					tbody 
						tr(v-for="menu in menus")
							td(style="cursor: pointer", @click="edit_menu(menu)")
								div.d-flex
									span.flex-grow-1 {{ menu }}
									button.btn.btn-sm.btn-outline-danger.py-0(@click.stop="delete_menu(menu)") X
						tr 
							td.text-center(style="cursor: pointer", @click="create_menu")
								span {{ $t('AddNew') }}

				div.text-center.mt-4
					button.btn.btn-lg.btn-primary.w-75(@click="$router.push('/generate')") {{ $t('Generate') }} 
				div.mt-3.text-center
					button.btn.btn-secondary(type="button", data-toggle="dropdown", aria-haspopup="true", aria-expanded="false") {{ $t("ImportExport") }} 
					div.dropdown-menu
						button.dropdown-item(@click="start_import") {{ $t("ImportJSON") }} 
						button.dropdown-item(@click="export_json") {{ $t("ExportJSON") }}
				input.d-none(type="file", @change="import_json", ref="importer")
			
			div.col
				h1 {{ $t("Menu") }} 
				table.table.table-sm.text-center
					thead
						tr 
							th {{ $t('Parameter') }}
							th {{ $t('Value') }}
					tbody 
						tr
							td.align-middle
								label.m-0 {{ $t("Name") }} 
							td 
								input.form-control.py-1.h-100(type="text", :placeholder="$t('ExampleName')", size="32", v-model="name", @input="name = name.replace(/[^a-zA-Z0-9_]/g, '')")
						tr
							td.align-middle
								label.m-0 {{ $t("Command") }} 
							td 
								div.input-group
									input.form-control.py-1.h-100(type="text", :placeholder="$t('ExampleCommand')", size="32", v-model="command", @input="command = command.replace(/[^a-zA-Z0-9_]/g, '')")
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
								label.m-0.form-check-label {{ $t("Type") }} 
							td.text-left
								input#type-menu.ml-3(name="menu-type", type="radio", value="menu", v-model="type", @change="sort_items") 
								label.my-0.mx-2.form-check-label(for="type-menu") {{ $t("MenuType") }}  
								input#type-panel(name="menu-type", type="radio", value="panel", v-model="type", @change="sort_items") 
								label.my-0.ml-2.form-check-label(for="type-panel") {{ $t("PanelType") }}  
						tr
							td.align-middle
								label.m-0 {{ $t("ExitBack") }} 
							td
								LiveSearch(v-if="type==='menu'", v-bind:title="$t('ExampleExitBack')", v-bind:menu_names="menus", v-model="exit_back", ref="exit_back")
								select.custom-select.h-100(v-else, disabled, style="padding: 0.16rem 0.5rem;")
									option {{ $t('MenuOnly') }}
				
				div.row#content
					div.col-6
						h2 {{ $t("Content") }}  
						div.row.mb-4
							div.input-group
								div.input-group-prepend
									span.input-group-text.py-1.h-100 {{ $t("Title") }}
								input#menu-title.form-control.py-1.h-100(type="text", :placeholder="$t('ExampleTitle')", v-model="title")
						
						draggable(v-model="items", :move="start_drag", @end="sort_items", handle=".handle", v-bind="dragOptions")
							transition-group(type="transition")
								div.mb-3(v-for="item of items", :key="item.text")
									div.row
										div.input-group
											div.input-group-prepend
												span.input-group-text.py-1.h-100(v-if="type==='menu'") {{ item.position }}
												select.input-group-text.py-1.h-100(v-else, v-model:value="item.position", @change="sort_items")
													option(value=" ") 
													option(v-for="value in 9" :value="value") {{ value }}
													option(value="0") 0
											input.form-control.py-1.h-100(type="text", :placeholder="$t('ExampleItem')", v-model="item.text")
											div.input-group-append
												button.btn.btn-secondary(@click="delete_item(item)", data-toggle="tooltip", data-placement="top", :title="$t('Delete')") X

									div.row
										div.input-group(v-for="action of item.actions")
											div.input-group-prepend
												span.input-group-text.py-1.h-100(v-if="action.action === 'open'") {{ $t("OpenMenu") }}
												span.input-group-text.py-1.h-100(v-if="action.action === 'pcmd'") {{ $t("ClientCommand") }}
												span.input-group-text.py-1.h-100(v-if="action.action === 'scmd'") {{ $t("ServerCommand") }}
												span.input-group-text.py-1.h-100(v-if="action.action === 'close'") {{ $t("CloseMenu") }}

											// input.form-control(v-if="action.action === 'open'", type="text", :placeholder="$t('ExampleOpenMenu')", v-model="action.target", @input="action.target = action.target.replace(/[^a-zA-Z]/g, '')", v-on:load="dump")
											LiveSearch(v-if="action.action === 'open'", v-bind:title="$t('ExampleOpenMenu')", v-bind:menu_names="menus", v-model="action.target")
											input.form-control.py-1.h-100(v-if="action.action === 'pcmd'", type="text", :placeholder="$t('ExampleClientCommand')", v-model="action.target")
											input.form-control.py-1.h-100(v-if="action.action === 'scmd'", type="text", :placeholder="$t('ExampleServerCommand')", v-model="action.target")
											input.form-control.py-1.h-100(v-if="action.action === 'close'", type="text", placeholder="", v-model="action.target", disabled)

											div.input-group-append
												button.btn.btn-secondary(@click="delete_action(item, action)", data-toggle="tooltip", data-placement="top", :title="$t('Delete')") X

										div.mt-1.w-100.d-flex.justify-content-between
											div(style="width: 0%; overflow: visible; cursor: all-scroll")
												i.fa.fa-align-justify.handle.ml-2(style="vertical-align: middle", v-if="type==='menu'", :title="$t('DragToMove')")
											div
												button.btn.btn-outline-secondary.btn-sm(type="button", data-toggle="dropdown", aria-haspopup="true", aria-expanded="false") {{ $t("AddAction") }}
												div.dropdown-menu
													button.dropdown-item(@click="add_action(item, 'open')") {{ $t("OpenMenu") }} 
													button.dropdown-item(@click="add_action(item, 'pcmd')") {{ $t("ClientCommand") }} 
													button.dropdown-item(@click="add_action(item, 'scmd')") {{ $t("ServerCommand") }} 
													button.dropdown-item(@click="add_action(item, 'close')") {{ $t("CloseMenu") }} 
											div
						
						div.row.mb-3
							div.mx-auto
								button.btn.btn-outline-secondary.mt-3(@click="add_item") {{ $t("AddItem") }} 

					div.col-1

					div.col-5
						h2 {{ $t("Preview") }} 
						div#preview.mb-4.shadow-lg(v-for="i in Math.ceil(items.length / items_per_page)", style="font-size: 18px")
							div.overflow-hidden
								div.raw-html {{ process_text(title) }}

							div.overflow-hidden(v-for="item in items.slice((i - 1) * items_per_page, i * items_per_page)")
								div(v-if="type==='menu'")
									div.raw-html(v-for="key, value in item.text.split('\\\\n')", v-bind:class="{'item-active': item.actions.length !== 0 && value === 0}") {{ value === 0 ? ((((item.position - 1) % items_per_page) + 1) + '. ') : '' }}{{ key }}
								div(v-else)
									div.raw-html(v-for="key, value in item.text.split('\\\\n')", v-bind:class="{'item-active': item.actions.length !== 0 && value === 0}") {{ item.position !== " " ? (item.position + '. ') : "" }}{{ key }}
							
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

						div.text-center
							button.btn.btn-lg.btn-primary.w-75(@click="save_menu", ref="save_menu") {{ $t("SaveMenu") }} 
</template>

<i18n src="../assets/locales.json"></i18n>

<script>
import LiveSearch from "../components/LiveSearch.vue";
import draggable from "vuedraggable";

export default {
	name: "index",

	components: {
		LiveSearch,
		draggable
	},

	data: function() {
		return {
			game: "csgo",
			menus: [],

			name: "",
			base_name: "",
			title: "",
			items: [{ position: 1, text: "", actions: [] }],
			items_per_page: 7,
			type: "menu",
			exit_back: "",
			command: "",
			flags: []
		};
	},

	created: function() {
		$(function() {
			$('[data-toggle="tooltip"]').tooltip();
		});

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

	mounted: function() {
		$("#flags").selectpicker();
	},

	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false
			};
		}
	},

	methods: {
		create_menu: function() {
			this.edit_menu("");
		},

		edit_menu: function(menu) {
			let change_menu = () => {
				this.base_name = this.name = menu;
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
				} else {
					this.title = "";
					this.items = [{ position: 1, text: "", actions: [] }];
					this.type = "menu";
					this.command = "";
					this.exit_back = "";
					this.flags = [];
				}

				$("#flags").selectpicker("val", this.flags);
				// seems like reactive action require one frame to start working
				setTimeout(() => {
					if (this.$refs.exit_back) {
						this.$refs.exit_back.refresh();
					}

					$(function() {
						$('[data-toggle="tooltip"]').tooltip();
					});
				}, 1);
			};

			let old = localStorage.getItem("_menubuilder_" + this.base_name);
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
						buttons: {
							leave: {
								text: this.$t("DoNotSave"),
								className: "btn-danger",
								value: "leave"
							},
							save: {
								text: this.$t("Save"),
								className: "btn-success",
								value: "save"
							},
							stay: {
								text: this.$t("Stay"),
								className: "btn-primary",
								value: "stay"
							}
						}
					}).then(value => {
						if (value === "leave") {
							change_menu();
						} else if (value === "save") {
							this.save_menu();
							change_menu();
						}
					});
				} else {
					change_menu();
				}
			} else {
				change_menu();
			}
		},

		delete_menu: function(menu) {
			this.$swal({
				title: this.$t("Attention"),
				text: this.$t("Confirm"),
				icon: "warning",
				buttons: [this.$t("Cancel"), this.$t("Delete")],
				dangerMode: true
			}).then(value => {
				if (value === true) {
					localStorage.removeItem("_menubuilder_" + menu);
					this.menus.splice(this.menus.indexOf(menu), 1);
				}

				if (this.name === menu) {
					this.base_name = "";
					this.edit_menu("");
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
		},

		add_item: function() {
			this.items.push({
				position: this.items.length + 1,
				text: "",
				actions: []
			});

			$(function() {
				$('[data-toggle="tooltip"]').tooltip();
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
			$(function() {
				$('[data-toggle="tooltip"]').tooltip();
			});
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
			if (this.name.length < 1) {
				return;
			}

			if (this.base_name !== this.name && this.base_name.length > 0) {
				localStorage.removeItem("_menubuilder_" + this.base_name);
				this.menus.splice(this.menus.indexOf(this.base_name), 1);
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

			if (this.menus.indexOf(this.name) === -1) {
				this.menus.push(this.name);
			}

			this.$refs.save_menu.innerText = this.$t("MenuSaved");
			setTimeout(() => {
				this.$refs.save_menu.innerText = this.$t("SaveMenu");
			}, 3000);
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
					this.items[i].position = Number(i + 1).toString();
				}
			}
		},

		start_drag: function() {
			if (this.type === "panel") {
				return false;
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
		localStorage.setItem("game", this.game);
		next();
	}
};
</script>

<style>
#content button[type="button"].btn.dropdown-toggle.btn-light {
	padding: 0.36rem 0.5rem;
	border: 1px solid #ccc;
}

button[type="button"].btn.dropdown-toggle.btn-light {
	padding: 0.16rem 0.5rem;
	border: 1px solid #ccc;
}

#preview {
	border-radius: 10px;
	padding: 10px 15px;
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
</style>
