const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
var randomColor = require('randomcolor'); // import the script

exports.run = (client, message, args) => {

  var color = randomColor(); // a hex code for an attractive color

  const embed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle(color)

  message.channel.send(embed).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

}