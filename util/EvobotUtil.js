<<<<<<< HEAD
const { GuildMember } = require("discord.js");
const { BOT_OWNER_ID } = require("../config.json");

module.exports = {
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
exports.canModifyQueue = (member) => {
  const { channelID } = member.voice;
  const botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    member.send("You need to join the voice channel first!").catch(console.error);
    return;
  }

  return true;
};

let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;
exports.MAX_PLAYLIST_SIZE = config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE;
exports.PRUNING = config ? config.PRUNING : process.env.PRUNING;
exports.STAY_TIME = config ? config.STAY_TIME : process.env.STAY_TIME;
exports.DEFAULT_VOLUME = config ? config.DEFAULT_VOLUME: process.env.DEFAULT_VOLUME;
