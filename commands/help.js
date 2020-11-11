const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",

  execute(message) {

    try {
      const config = require("../config.json");
      BOT_NAME = config.BOT_NAME;
    }
    catch(error) {
      console.log("Error (commands/help.js 15): ", error)
    }

    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle(BOT_NAME)
      .setDescription("List of all commands")
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
