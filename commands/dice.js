const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args) => {
  let replies = ["One", "Two", "Three", "Four", "Five", "Six"];
  let result = Math.floor((Math.random() * replies.length));

  try {
    let newembed = new Discord.RichEmbed()
      .setAuthor("A dice has been rolled!")
      .setColor("#00FF00")
      .setDescription("Rolled By: " + message.author.username + "\nResult: " + replies[result]);

    message.channel.send({
      embed: newembed
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  } catch (e) {
    console.log(e.stack);
  }; // The try is because it errored when I didn't do it.
};