<template lang="pug">
	div.container
		h1 {{ $t("Information") }}  
		table.table.table-sm
			tbody 
				tr
					td 
						label.mr-3 {{ $t("Name") }}  
					td 
						input.form-control(type="text", :placeholder="$t('ExampleName')", size="32", v-model="name")
				tr
					td 
						label.mr-3 {{ $t("Author") }}  
					td 
						input.form-control(type="text", :placeholder="$t('ExampleAuthor')", size="32", v-model="author")
				tr
					td 
						label.mr-3 {{ $t("Description") }}  
					td 
						input.form-control(type="text", :placeholder="$t('ExampleDescription')", size="32", v-model="description")
				tr
					td 
						label.mr-3 {{ $t("Version") }}  
					td 
						input.form-control(type="text", :placeholder="$t('ExampleVersion')", size="32", v-model="version")
				tr
					td 
						label.mr-3 {{ $t("Link") }}  
					td 
						input.form-control(type="text", :placeholder="$t('ExampleLink')", size="32", v-model="url")

		div.d-flex.justify-content-around.mt-5
			button.btn.btn-warning.btn-lg.w-25(@click="$router.push('./')") {{ $t("GoBack") }}  
			button.btn.btn-primary.btn-lg.w-50(@click="save_as_plugin()") {{ $t("DownloadSp") }}  
		
		h1.mt-3 {{ $t("Debug") }}    
		textarea.w-100.mt-3(ref="output", rows="12", style="font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace")
</template>

<i18n>
{
	"en": {
		"Information": "Plugin's information",
		"Name": "Name:",
		"ExampleName": "My menu",
		"Author": "Author:",
		"ExampleAuthor": "Me",
		"Description": "Description:",
		"ExampleDescription": "My beautiful menus",
		"Version": "Version:",
		"ExampleVersion": "1.0",
		"Link": "URL:",
		"ExampleLink": "https://www.example.com/",
		"Actions": "Actions",
		"GoBack": "Back",
		"DownloadSp": "Download source code (.sp)",
		"Debug": "Debug log"
	},
	"ru": {
		"Information": "Информация о плагине",
		"Name": "Название плагина:",
		"ExampleName": "Моё меню",
		"Author": "Автор плагина:",
		"ExampleAuthor": "Я",
		"Description": "Описание плагина:",
		"ExampleDescription": "В этом плагине мои меню",
		"Version": "Версия плагина:",
		"ExampleVersion": "1.0",
		"Link": "Ссылка плагина:",
		"ExampleLink": "https://www.example.com/",
		"Actions": "Действия",
		"GoBack": "Назад",
		"DownloadSp": "Скачать исходный код плагина (.sp)",
		"Debug": "Отладка"
	}
}
</i18n>

<style>
</style>

<script>
export default {
	name: "generate",

	data: function() {
		return {
			name: "",
			author: "",
			description: "",
			version: "",
			url: "",
			items_per_page: 0
		};
	},

	created: function() {
		let game = localStorage.getItem("game") || "csgo";
		this.items_per_page = game === "csgo" ? 6 : 7;

		let proxy = JSON.parse(localStorage.getItem("pluginInformation"));
		if (proxy) {
			this.name = proxy.name;
			this.author = proxy.author;
			this.description = proxy.description;
			this.version = proxy.version;
			this.url = proxy.url;
		}
	},

	methods: {
		save_as_json: function() {
			localStorage.setItem(
				"pluginInformation",
				JSON.stringify({
					name: this.name,
					author: this.author,
					description: this.description,
					version: this.version,
					url: this.url
				})
			);

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

			// this.$refs.output.value = JSON.stringify(output);
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

		save_as_plugin: function() {
			localStorage.setItem(
				"pluginInformation",
				JSON.stringify({
					name: this.name,
					author: this.author,
					description: this.description,
					version: this.version,
					url: this.url
				})
			);

			let data = {};
			let names = [];
			let key;
			let prefix = "_menubuilder_";
			for (let i = 0; i < localStorage.length; ++i) {
				key = localStorage.key(i);
				if (key.startsWith(prefix)) {
					names.push(key.substr(prefix.length));
					data[key.substr(prefix.length)] = JSON.parse(
						localStorage.getItem(key)
					);
				}
			}

			let header = this.create_header();
			let variables = this.create_variables(data, names);
			let plugin_start = this.create_plugin_start(data, names);
			let commands = this.create_commands(data, names);

			let output = "";
			output += header;
			output += `\n`;

			output += variables;
			output += `\n`;

			output += plugin_start;
			output += `\n`;

			output += commands;
			output += `\n`;

			for (let i = 0; i < names.length; ++i) {
				if (data[names[i]].type === "menu") {
					output += this.create_menu_handler(
						names[i],
						data[names[i]],
						data
					);
				} else {
					output += this.create_panel_handler(
						names[i],
						data[names[i]],
						data
					);
				}
			}

			// this.$refs.output.value = output;
			this.save_file(`${this.name || "imenubuilder"}.sp`, output);
		},

		create_header() {
			let output = "";
			output += `#include <sourcemod>\n`;
			output += `\n`;

			output += `public Plugin:myinfo = \n`;
			output += `{\n`;
			output += `    name        = "${this.name}",\n`;
			output += `    author      = "${this.author}",\n`;
			output += `    description = "${this.description}",\n`;
			output += `    version     = "${this.version}",\n`;
			output += `    url         = "${this.url}"\n`;
			output += `}\n`;

			return output;
		},

		create_variables(data, names) {
			let output = "";
			for (let i = 0; i < names.length; ++i) {
				output += `new Handle: g_${names[i]};\n`;

				if (
					data[names[i]].items &&
					data[names[i]].items.length > this.items_per_page
				) {
					output += `new g_${names[i]}_position[MAXPLAYERS + 1];\n`;
				}
			}

			return output;
		},

		create_plugin_start(data, names) {
			let output = "";
			output += `public OnPluginStart()\n`;
			output += `{\n`;
			for (let i = 0; i < names.length; ++i) {
				if (
					data[names[i]].command &&
					data[names[i]].command.length > 0
				) {
					if (data[names[i]].flags.length === 0) {
						output += `    RegConsoleCmd("${
							data[names[i]].command
						}", Command_OpenMenu_${names[i]});\n`;
					} else {
						output += `    RegAdminCmd("${
							data[names[i]].command
						}", Command_OpenMenu_${names[i]}, ${
							data[names[i]].flags
						});\n`;
					}
				}
			}

			for (let i = 0; i < names.length; ++i) {
				if (data[names[i]].type === "menu") {
					output += this.create_menu(names[i], data[names[i]]);
				} else {
					output += this.create_panel(names[i], data[names[i]]);
				}
			}
			output += `}\n`;

			return output;
		},

		create_menu(name, menu) {
			let output = "\n";
			output += `    g_${name} = CreateMenu(Handler_${name});\n`;
			output += `    SetMenuTitle(g_${name}, "${menu.title.replace(/"/g, '\\"')}")\n`;
			for (let i = 0; i < menu.items.length; ++i) {
				if (menu.items[i].actions && menu.items[i].actions.length > 0) {
					output += `    AddMenuItem(g_${name}, "${
						menu.items[i].position
					}", "${this.format_text(menu.items[i].text)}")\n`;
				} else {
					output += `    AddMenuItem(g_${name}, "${
						menu.items[i].position
					}", "${this.format_text(menu.items[i].text)}", ITEMDRAW_DISABLED)\n`;
				}
			}
			if (menu.exit_back && menu.exit_back.length > 0) {
				output += `    SetMenuExitBackButton(g_${name}, true);\n`;
			}

			return output;
		},

		create_panel(name, menu) {
			let output = "\n";
			output += `    g_${name} = CreatePanel();\n`;
			output += `    SetPanelTitle(g_${name}, "${menu.title.replace(/"/g, '\\"')}")\n`;
			for (let i = 0; i < menu.items.length; ++i) {
				if (menu.items[i].position != 0) {
					output += `    SetPanelCurrentKey(g_${name}, ${
						menu.items[i].position
					})\n`;
				}

				if (menu.items[i].actions && menu.items[i].actions.length > 0) {
					output += `    DrawPanelItem(g_${name}, "${
						this.format_text(menu.items[i].text)
					}")\n`;
				} else {
					output += `    DrawPanelText(g_${name}, "${
						this.format_text(menu.items[i].text)
					}")\n`;
				}
			}

			return output;
		},

		create_commands(data, names) {
			let output = "";
			for (let i = 0; i < names.length; ++i) {
				if (
					data[names[i]].command &&
					data[names[i]].command.length > 0
				) {
					output += `public Action:Command_OpenMenu_${
						names[i]
					}(client, argc)\n`;
					output += `{\n`;
					output += this.display_menu(names[i], data, "    ", false);
					output += `    return Plugin_Handled;\n`;
					output += `}\n`;
				}
			}

			return output;
		},

		create_menu_handler(name, menu, menus) {
			let output = "";
			output += `public Handler_${name}(Handle:menu, MenuAction:action, client, slot)\n`;
			output += `{\n`;

			output += `    switch (action)\n`;
			output += `    {\n`;
			output += `        case MenuAction_Select:\n`;
			output += `        {\n`;
			output += `            decl String:info[64];\n`;
			output += `            GetMenuItem(menu, slot, info, sizeof(info));\n`;
			output += `            \n`;

			let first = true;
			for (let i = 0; i < menu.items.length; ++i) {
				if (menu.items[i].actions && menu.items[i].actions.length > 0) {
					if (first) {
						output += `            if (StrEqual(info, "${
							menu.items[i].position
						}"))\n`;
						first = false;
					} else {
						output += `            else if (StrEqual(info, "${
							menu.items[i].position
						}"))\n`;
					}

					output += `            {\n`;

					let variables = "";
					let ex_auth = false,
						ex_uid = false;
					for (let j = 0; j < menu.items[i].actions.length; ++j) {
						if (
							menu.items[i].actions[j].action === "pcmd" ||
							menu.items[i].actions[j].action === "scmd"
						) {
							if (
								!ex_auth &&
								menu.items[i].actions[j].target.indexOf(
									"{auth}"
								) !== -1
							) {
								variables += `                decl String:auth[32];\n`;
								variables += `                GetClientAuthString(client, auth, sizeof(auth));\n`;
								variables += `                \n`;
								ex_auth = true;
							}
							if (
								!ex_uid &&
								menu.items[i].actions[j].target.indexOf(
									"{uid}"
								) !== -1
							) {
								variables += `                new userid = GetClientUserId(client);\n`;
								variables += `                \n`;
								ex_uid = true;
							}
						}
					}
					output += variables;

					for (let j = 0; j < menu.items[i].actions.length; ++j) {
						if (menu.items[i].actions[j].action === "open") {
							if (
								menus[menu.items[i].actions[j].target] &&
								menus[menu.items[i].actions[j].target]
									.exit_back !== "" &&
								menus[name].items.length > this.items_per_page
							) {
								output += `                g_${name}_position[client] = GetMenuSelectionPosition();\n`;
							}

							output += this.display_menu(
								menu.items[i].actions[j].target,
								menus,
								"                ",
								false
							);
						} else if (menu.items[i].actions[j].action === "pcmd") {
							output += this.format_command(
								menu.items[i].actions[j].target,
								"client, ",
								"FakeClientCommand",
								"                "
							);
						} else if (menu.items[i].actions[j].action === "scmd") {
							output += this.format_command(
								menu.items[i].actions[j].target,
								"",
								"ServerCommand",
								"                "
							);
						}
					}
					output += `            }\n`;
				}
			}
			output += `        }\n`;

			if (menu.exit_back && menu.exit_back.length > 0) {
				output += `        case MenuAction_Cancel:\n`;
				output += `        {\n`;
				output += `            if (slot == MenuCancel_ExitBack)\n`;
				output += `            {\n`;
				output += this.display_menu(
					menu.exit_back,
					menus,
					"                ",
					true
				);
				output += `            }\n`;
				output += `        }\n`;
			}

			output += `    }\n`;

			output += `}\n`;
			output += `\n`;

			return output;
		},

		create_panel_handler(name, menu, menus) {
			let output = "";
			output += `public Handler_${name}(Handle:panel, MenuAction:action, client, slot)\n`;
			output += `{\n`;

			output += `    switch (action)\n`;
			output += `    {\n`;
			output += `        case MenuAction_Select:\n`;
			output += `        {\n`;

			let first = true;
			for (let i = 0; i < menu.items.length; ++i) {
				if (menu.items[i].actions && menu.items[i].actions.length > 0) {
					if (first) {
						output += `            if (slot == ${
							menu.items[i].position
						})\n`;
						first = false;
					} else {
						output += `            else if (slot == ${
							menu.items[i].position
						})\n`;
					}

					output += `            {\n`;

					let variables = "";
					let ex_auth = false,
						ex_uid = false;
					for (let j = 0; j < menu.items[i].actions.length; ++j) {
						if (
							menu.items[i].actions[j].action === "pcmd" ||
							menu.items[i].actions[j].action === "scmd"
						) {
							if (
								!ex_auth &&
								menu.items[i].actions[j].target.indexOf(
									"{auth}"
								) !== -1
							) {
								variables += `                decl String:auth[32];\n`;
								variables += `                GetClientAuthString(client, auth, sizeof(auth));\n`;
								variables += `                \n`;
								ex_auth = true;
							}
							if (
								!ex_uid &&
								menu.items[i].actions[j].target.indexOf(
									"{uid}"
								) !== -1
							) {
								variables += `                new userid = GetClientUserId(client);\n`;
								variables += `                \n`;
								ex_uid = true;
							}
						}
					}
					output += variables;

					for (let j = 0; j < menu.items[i].actions.length; ++j) {
						if (menu.items[i].actions[j].action === "open") {
							output += this.display_menu(
								menu.items[i].actions[j].target,
								menus,
								"                ",
								false
							);
						} else if (menu.items[i].actions[j].action === "pcmd") {
							output += this.format_command(
								menu.items[i].actions[j].target,
								"client, ",
								"FakeClientCommand",
								"                "
							);
						} else if (menu.items[i].actions[j].action === "scmd") {
							output += this.format_command(
								menu.items[i].actions[j].target,
								"",
								"ServerCommand",
								"                "
							);
						}
					}
					output += `            }\n`;
				}
			}
			output += `        }\n`;

			output += `    }\n`;

			output += `}\n`;
			output += `\n`;

			return output;
		},

		display_menu: function(menu, menus, offset, exit_back) {
			let output = "";
			if (typeof menus[menu] !== "undefined") {
				if (menus[menu].type === "menu") {
					if (
						exit_back &&
						menus[menu].items.length > this.items_per_page
					) {
						output += `${offset}DisplayMenuAtItem(g_${menu}, client, g_${menu}_position[client], MENU_TIME_FOREVER);\n`;
					} else {
						output += `${offset}DisplayMenu(g_${menu}, client, MENU_TIME_FOREVER);\n`;
					}
				} else {
					output += `${offset}SendPanelToClient(g_${menu}, client, Handler_${menu}, MENU_TIME_FOREVER);\n`;
				}
			}

			return output;
		},

		format_command(command, prefix, fn, offset) {
			let output = "";

			let args = "";
			let cycle = true;
			while (cycle) {
				let cid = command.indexOf("{cid}");
				let uid = command.indexOf("{uid}");
				let auth = command.indexOf("{auth}");

				if (cid + uid + auth !== -3) {
					if (cid === -1) cid = 1000000;
					if (uid === -1) uid = 1000000;
					if (auth === -1) auth = 1000000;

					if (cid < uid) {
						if (cid < auth) {
							command = command.replace("{cid}", "%d");
							args += ", client";
						} else {
							command = command.replace("{uid}", "%d");
							args += ", userid";
						}
					} else {
						if (uid < auth) {
							command = command.replace("{uid}", "%d");
							args += ", userid";
						} else {
							command = command.replace("{auth}", "%s");
							args += ", auth";
						}
					}
				} else {
					command = command.replace(/"/g, '\\"');
					output += `${offset}${fn}(${prefix}"${command}"${args});\n`;
					cycle = false;
				}
			}

			return output;
		},

		format_text: function(text) {
			return text.replace(/"/g, '\\"').replace(/%/g, '%%');
		}
	}
};
</script>
