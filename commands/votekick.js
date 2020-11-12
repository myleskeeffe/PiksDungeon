const { db } = require("../util/db");

module.exports = {
    name: "votekick",
    aliases: ["vk"],
    description: "Vote to Kick someone. \n Use .vk help for more info",
    execute(message, args) {
        if (!args.length) {
            message.reply("I didn't get that. Please check .vk help")
        }
        else if (args[0].toLowerCase() == "help") {

        }
        else if (args[0].toLowerCase() == "config") {
            if (args[1].toLowerCase() == "set") {
                switch (args[2].toLowerCase()) {
                    case 'allowedrole':
                        async function setallowedrole() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkAllowedRole'
                            await db.put(keyId, message.mentions.roles.first().id);
                        }
                        setallowedrole();
                        break;
                    case 'minvotes':
                        break;
                }

            }
            else if (args[1].toLowerCase() == "get") {
                async function get() {
                    switch (args[2].toLowerCase()) {
                        case 'allowedrole':
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkAllowedRole'
                            let keyValue = await db.get(keyId)
                            message.reply(keyValue)
                            break;
                    }

                }
                get()
            }
        }
        else if (message.mentions.members.first()) {
            // Vote Kick User
        }
        else {
            message.reply("I didn't get that. Please check .vk help")
        }
    }
};
