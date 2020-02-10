const Discord = require('discord.js');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {
  if (!args[0]) {
    const errEmbed = new Discord.RichEmbed()
      .setColor(0xFF2222)
      .setAuthor('Error')
      .setTitle(':exclamation: Usage: **8ball (question)**');
    message.channel.send({
      embed: errEmbed
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
    return;
  }

  var sayings = [
    "FUCKING YES",
    "My categorical yes",
    "Certainly",
    "Without a doubt",
    "DEFINITELY NOT",
    "Idk",
    "Likely",
    "Think yes...",
    "Yes",
    "My dick says 'yes'",
    "An$w3r 1s V3r^ $tr@ng3!",
    "@$k 1@t3r",
    "Uff, I think you should't know this...",
    "I don't think so",
    "FUCKING NO",
    "Google says 'no'",
    "NO",
    "Doubtfully"
  ];

  var result = Math.floor((Math.random() * sayings.length));
  const ballEmb = new Discord.RichEmbed()
    .setColor(0x00FFFF)
    .setAuthor('8ball', 'https://findicons.com/files/icons/1700/2d/512/8_ball.png')
    .addField(args, sayings[result]);
  message.channel.send({
    embed: ballEmb
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
}