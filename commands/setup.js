const { BOT_OWNER_ID, BOT_NAME } = require("../config.json");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "setup",
    description: "Run setup commands for your server",
    async execute(message, args) {

        var hasOwner = false;
        var hasAdmin = false;
        if (message.author.id == BOT_OWNER_ID) { var hasOwner = true; }
        if (message.guild.member(message.author).hasPermission('ADMINISTRATOR')) { var hasAdmin = true; }

        if (!hasOwner && !hadAdmin) {
            return (message.reply("Sorry - you don't have the needed permissions to run that command.").catch(console.error))
        }

        if (!args.length) {
            return (message.reply("Sorry - check .setup help").catch(console.error))
        }

        if (args[0].toLowerCase() == "help") {
            let infoEmbed = new MessageEmbed()
                .setTitle(BOT_NAME)
                .setDescription("Bot Setup Help")
                .setColor("#F8AA2A");

            infoEmbed.addField('**.setup perms**', "Checks bot permissions.", true);
            infoEmbed.addField('**.setup config**', "Configure the bot.", true);

            infoEmbed.setTimestamp();

            message.channel.send(infoEmbed).catch(console.error);
        }

        else if (args[0].toLowerCase() == "perms") {
            message.channel.send("Running checks now. Please wait a moment.").catch(console.error);
            var botAdmin = await message.guild.member(message.client.user).hasPermission('ADMINISTRATOR');
            if (botAdmin) {
                var botAdminCheck = "✅"
            }
            else {
                var botAdminCheck = "❎"
            }

            var botManage = await message.guild.member(message.client.user).hasPermission('MANAGE_GUILD');
            if (botManage) {
                var botManageCheck = "✅"
            }
            else {
                var botManageCheck = "❎"
            }
            
            var botAudit = await message.guild.member(message.client.user).hasPermission('VIEW_AUDIT_LOG');
            if (botAudit) {
                var botAuditCheck = "✅"
            }
            else {
                var botAuditCheck = "❎"
            }

            var botRoles = await message.guild.member(message.client.user).hasPermission('MANAGE_ROLES');
            if (botRoles) {
                var botRolesCheck = "✅"
            }
            else {
                var botRolesCheck = "❎"
            }

            let infoEmbed = new MessageEmbed()
                .setTitle(BOT_NAME)
                .setDescription("Bot Perms Check")
                .setColor("#F8AA2A")
            
            infoEmbed.addField('**Administrator**', botAdminCheck + " - Required to override channel & role specific perms to run vote kicks and prune the bot's messages.", true)
            infoEmbed.addField('**Manage Server**', botManageCheck + " - Only needed if you wish to use advanced moderation capabilities.", true)
            infoEmbed.addField('**View Audit Log**', botAuditCheck + " - Only needed if you want the bot to autolog mod actions it/other bots take.", true)
            infoEmbed.addField('**Manage Roles**', botRolesCheck + " - Only needed if you want to use the bots role management capabilities.", true)
            infoEmbed.addField('**Role Position**', "?" + " - Ensure bot has 'top' role, this allows it to run moderation commands or change roles (for autorole) or run commands against users in the server.", true)

            message.channel.send(infoEmbed);

        }

        else if (args[0].toLowerCase() == "config") {
            message.reply("This functionality is still WIP.")
        }

        else {
            message.reply("Sorry I didn't catch that, please check .bot setup help")
        }

    }
};
