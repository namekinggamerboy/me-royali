const Discord = require('discord.js');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {
  var resp = 
    "Members: " + message.guild.memberCount + "\n" +
    "Online: " + message.guild.members.filter(o => o.presence.status === 'online').size + "\n" +
    "Away: " + message.guild.members.filter(i => i.presence.status === 'idle').size + "\n" +
    "Offline: " + message.guild.members.filter(a => a.presence.status === 'offline').size;

  let embed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setDescription(resp)
    .setTitle("Stats")
    .setFooter(message + " | Owner: " + message.guild.owner.user.tag);

  message.channel.send(embed);
}