const { BOT_OWNER_ID, BOT_NAME } = require("../config.json");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "memberinfo",
    description: "Test Member Perms",
    execute(message) {
        let infoEmbed = new MessageEmbed()
            .setTitle(BOT_NAME)
            .setDescription("List of user's perms")
            .setColor("#F8AA2A");
        hasOwner = false;
        hasAdmin = false;
        if (message.author.id == BOT_OWNER_ID) { var hasOwner = true; }
        if (message.guild.member(message.author).hasPermission('ADMINISTRATOR')) { var hasAdmin = true; }

        infoEmbed.addField('**Bot Owner**', hasOwner, true);
        infoEmbed.addField('**Server Admin**', hasAdmin, true);

        infoEmbed.setTimestamp();

        message.channel.send(infoEmbed).catch(console.error);
    }
};
