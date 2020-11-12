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
            async function voteKick() {
                let serverId = await message.guild.id;
                let keyId = serverId + '.' + 'voteKickT2' + '.' + message.mentions.members.first().id;
                try {
                    let votes = await db.get(keyId);
                    if (votes) {
                        let voteArray = await JSON.parse(votes);
                        if (voteArray.includes(message.author.id)) {
                            message.reply("Hey no double dipping!");
                        }
                        else {
                            voteArray.push(message.author.id);
                            let voteArrayJSON = await JSON.stringify(voteArray);
                            await db.put(keyId, voteArrayJSON)
                            message.reply("Adding Vote to " + message.mentions.members.first().toString() + "'s Vote Kick (" + voteArray.length() + "/5)");
                            if (voteArray.length() >= db.get(serverId + 'settings' + '.' + 'vkMinVotes')) {
                                message.reply("Vote Kick for " + message.mentioned.members.first().toString() + " Succeeded")
                            }
                        }
                    }
                }
                catch(err) {
                    if (err.notFound) {
                        // Couldn't find a Key for User - Initiate Vote Kick
                        message.channel.send("Vote Kick For: " + message.mentions.members.first().toString() + " Started by: " + message.author.toString() + "\n.vk " + message.mentions.members.first().toString() + " to vote yes. (1/5)")
                        let voteArray = [];
                        await voteArray.push(message.author.id);
                        let voteArrayJSON = await JSON.stringify(voteArray);
                        await db.put(keyId, voteArrayJSON);
                    }
                }
            }
            voteKick();
        }
        else {
            message.reply("I didn't get that. Please check .vk help")
        }
    }
};
