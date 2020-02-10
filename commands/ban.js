const Discord = require('discord.js');
var utils = require('bot-utils');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ops) => {

  let BReasons = [
    "I'm sorry, friend, but someone's stray hand today",
    "From the heart",
    "Just because",
    "Ban, haha",
    "You asked for it",
    "Just ban"
  ];

  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
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
  if (!BMember.bannable) return message.reply("he is too dangerous >_<").then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  var embed = new Discord.RichEmbed()
    .setColor(0xFF2222)
    .setTitle("B A N")
    .setDescription(`🔨 ${BMember.user.tag} banned for reason \n**${BReason}**`);

  BMember.ban(BReason).catch(error => message.reply(`Fuck\n${message.author.username},\n` + "```" + error + "```"));
  message.channel.send(embed);
  BMember.send(embed)

}