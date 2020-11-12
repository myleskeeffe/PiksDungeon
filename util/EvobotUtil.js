const { GuildMember } = require("discord.js");
const { BOT_OWNER_ID } = require("../config.json");

module.exports = {
  canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
      member.send("You need to join the voice channel first!").catch(console.error);
      return;
    }

    return true;
  },
  hasAdminPerms(member) {
    hasOwner = false;
    hasAdmin = false;
    if (member.id == BOT_OWNER_ID) { var hasOwner = true; }
    if (member.hasPermission('ADMINISTRATOR')) { var hasAdmin = true; }
    if (hasOwner || hasAdmin) {
      return true;
    }
    else {
      return false;
    }
  }
};
