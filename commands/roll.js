var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  
  var result = Math.floor(Math.random() * args[0]);

  if (args.length == 0) result = Math.floor(Math.random() * 100);
  
  message.channel.send({
    embed: {
      "description": "Result: " + result,
      "color": 0x42f4aa,
      "title": "Rolled by " + message.author.username
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });

}