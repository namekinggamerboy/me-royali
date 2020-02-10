const Discord = require('discord.js');
const db = require('quick.db');
var currencyFormatter = require('currency-formatter'); //For currency
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args) => { //Collecting info about command
  let member = message.mentions.members.first();
  if (!member) member = message.member;

  let balance = await db.fetch(`balance_${member.guild.id}_${member.id}`);
  
  if (balance == null) balance = 0;

  var embed = new Discord.RichEmbed()
    .setColor(0x6EFFE4)
    .setTitle("Balance")
    .setDescription("**" + currencyFormatter.format(balance, { code: 'USD' }) + "**");

  message.channel.send(embed).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
}