const Discord = require("discord.js");
const db = require('quick.db');
var currencyFormatter = require('currency-formatter'); //For currency
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ops) => {
    if (message.guild.id !== "264445053596991498" && conf[message.guild.id].levelup === 'false') return message.channel.send('this levelup is disabled');
  var points = new db.table("TOTAL_POINTS");
  points.startsWith(`${message.guild.id}`, {
    sort: '.data'
  }).then(resp => {
    resp.length = 15;

    let title = 'Leaderboards';
    var finalLb = "";
    var i = 0;
    for (i in resp) {
      finalLb += `**${client.users.get(resp[i].ID.split('_')[1]).username}** - \`${resp[i].data}xp\`\n`;
    }

    message.channel.send({
      embed: {
        "description": finalLb,
        "title": title,
        "color": "RANDOM",
        thumbnail: {
          url: message.guild.iconURL(),
        }
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  });
}