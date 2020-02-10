const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, config) => {

  let question = args.join(' ');

  message.channel.send({
    embed: {
      "title": "Опрос:",
      "description": question + "",
      "color": "3264944",
      "footer": {
        "text": "Опрос создал " + message.author.username,
        "icon_url": message.author.avatarURL
      }
    }
  }).then(() => {
    message.channel.awaitMessages(response => response.content === "test", {
        max: 5,
        time: 10000,
        errors: ['test'],
      })
      .then((collected) => {
        message.channel.send(`The collected message was: ${collected.content}`);
      })
      .catch(() => {
        message.channel.send('There was no collected message that passed the filter within the time limit!');
      });
  });

}