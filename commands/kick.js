const Discord = require('discord.js');
var utils = require('bot-utils');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ops) => {

  let BReasons = [
    "I'm sorry, friend, but someone's stray hand today",
    "From the heart",
    "Just because",
    "Kick, haha",
    "You asked for it",
    "Just kick"
  ];

  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied!",
      "color": 0xff2222,
      "title": "Error"
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  let BMember = message.mentions.members.first();
  let BReason = args.slice(1).join(" ");
  if (!BReason) {
    BReason = BReasons[Math.floor(Math.random() * BReasons.length)];
  }
  if (!BMember) return message.reply("please, mention user, or i'll *pf,fy. dct[ yf[eq!*").then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  if (BMember.id == 464747957288435732) return message.reply("are you f*cking serious?").then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  if (!BMember.kickable) return message.reply("he is too dangerous >_<").then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  var embed = new Discord.RichEmbed()
    .setColor(0xFF2222)
    .setTitle("KICK")
    .setDescription(`🔨 ${BMember.user.tag} kicked for reason \n**${BReason}**`);
  BMember.kick(BReason).catch(error => message.reply(`Да что за день то такой сегодня! Не смог забанить ${message.author}, хз почему, но может быть из-за: \n` + "```" + error + "```"));
  message.channel.send(embed);
  BMember.send(embed);
}