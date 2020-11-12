const { db } = require("../util/db");
const { BOT_NAME } = require("../config.json")
const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "votekick",
    aliases: ["vk"],
    description: "Vote to Kick someone. \n Use .vk help for more info",
    execute(message, args) {
        if (!args.length) {
            message.reply("I didn't get that. Please check .vk help")
        }
        else if (args[0].toLowerCase() == "help") {

            let helpEmbed = new MessageEmbed()
                .setTitle(BOT_NAME)
                .setDescription("Vote Kick")
                .setColor("#F8AA2A");

            helpEmbed.addField('**.vk @<user>**', 'Start a Votekick against @<user>', true)
            helpEmbed.addField('**.vk config set allowedrole @<role>**', 'Set a role which can start/vote on VoteKicks.', true)
            helpEmbed.addField('**.vk config get allowedrole**', 'See which role can start/vote on VoteKicks.', true)
            helpEmbed.addField('**.vk config set minvotes <num>**', 'Set minimum number of votes for VoteKick to succeed.', true)
            helpEmbed.addField('**.vk config get minvotes**', 'See minimum number of votes for VoteKick to succeed.', true)

            message.channel.send(helpEmbed).catch(console.error);
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
                        async function setminvotes() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkMinVotes'
                            await db.put(keyId, args[3]);
                        }
                        setminvotes();
                        break;
                }

            }
            else if (args[1].toLowerCase() == "get") {
                switch (args[2].toLowerCase()) {
                    case 'allowedrole':
                        async function getAllowedRole() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkAllowedRole';
                            let keyValue = await db.get(keyId);
                            let roleName = await message.guild.roles.resolve(keyValue).name;
                            message.reply(roleName);
                        }
                        try {
                            getAllowedRole();
                        }
                        catch (error) {
                            console.error
                        }
                        break;
                    case 'minvotes':
                        async function getMinVotes() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkMinVotes';
                            let keyValue = await db.get(keyId);
                            message.reply(keyValue);
                        }
                        getMinVotes();
                        break;
                }
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
