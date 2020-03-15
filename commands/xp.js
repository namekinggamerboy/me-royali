const Discord = require('discord.js');
var db = require('quick.db'); //Database lib
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {
  if (message.guild.id !== "264445053596991498" && conf[message.guild.id].levelup === 'false') return message.channel.send('this levelup is disabled');
  const points = new db.table('POINTS');
  const levels = new db.table('LEVELS');
  const xp = new db.table('TOTAL_POINTS');
  
    let member = message.mentions.members.first();
  if (!member) member = message.member;
 
    if (member.user.bot) return message.channel.send({ embed: {
    "description": "**I can't show bot's xp because it's bot after all!**",
    "color": 0xff2222
  } });
  points.fetch(`${message.guild.id}_${member.id}`, {"target": ".data"}).then(pnts => {
    levels.fetch(`${message.guild.id}_${member.id}`, {"target": ".data"}).then(lvl => {
      xp.fetch(`${message.guild.id}_${member.id}`, {"target": ".data"}).then(x => {
      var xpReq = lvl * 300 - pnts;
      
      if (xpReq <= 0) xpReq = 0; 
  
      var embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("XP | Level")
        .addField("XP", pnts, true)
        .addField("Level", lvl, true)
        .addField("Points left to next level", xpReq, false)
        .setFooter("Total XP: " + x);
  
        message.channel.send(embed).then(msg => {
        if (conf[message.guild.id].delete == 'true') {
          msg.delete(conf[message.guild.id].deleteTime);
        }
      });
    });
  });
  });
  }
