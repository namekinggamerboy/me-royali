const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  
  let rolea = args.join(" ");
  
 if(!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return;
 
  let role = message.guild.roles.find(r => r.name === rolea) || message.mentions.roles.first();

if (!role) return message.channel.send(`**${message.author.username}**, role not found`)

message.guild.members.filter(m => !m.user.bot).forEach(member => member.addRole(role))
  
message.channel.send(`**${message.author.username}**, role **<@&${role.id}>** was added to all members`)
};
