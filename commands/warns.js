var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {

  const userwarn = new db.table('USERWARNINGs');

  userwarn.startsWith(`warn_${message.author.id}`).then(resp => {

    let title = 'Warns';
    var finalLb = "";
    var i = 0;
    var num = 1;
    for (i in resp) {
      finalLb += `${num}. ${client.users.get(resp[i].ID.split('_')[1]).username} - \`${resp[i].data}\`\n`;
      num++;
    }

    if (finalLb == '') {
      finalLb = "You don\'t have any warns";
    }

    message.channel.send({
      embed: {
        "description": finalLb,
        "title": title,
        "color": 16777215
      }
    }).then(msg => {
      if (config[message.guild.id].delete === "true") {msg.delete(config[message.guild.id].deleteTime);}
    });
  });

}