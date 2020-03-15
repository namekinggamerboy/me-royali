const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  let emojis;
  if (message.guild.emojis.size === 0)
    emojis = "There are no emojis on this server.";
  let emojisemb = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name} Emojis`)
    .setColor("0099ff")
    .setDescription(`${message.guild.emojis.map(e => e).join(" ")}`);
  message.channel.send(emojisemb);
};
