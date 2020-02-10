const Discord = require('discord.js');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {

  var resp = 
    "**Bot users: **" + client.users.size + "\n" +
    "**Bot guilds: **" + client.guilds.size + "\n" +
    "**Bot channels: **" + client.channels.size + "\n\n" +
    "**Created on** `discord.js`"
  var footer = 
    "Created by nameboy#2751"
  
  var embed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setDescription(resp)
    .setFooter(footer)
    .setTitle("About | Click to join support server")
    .setURL("https://discord.gg/Z")
  
  message.channel.send(embed);
  
}