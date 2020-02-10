const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args, ops) => { //Collecting info about command
  if (message.author.id !== ops.ownerId) return message.channel.send({
    embed: {
      "title": 'Nope',
      "color": 0xff2222
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  }); //If author of message isn't a bot owner, then warn him.
  if (args[0] != undefined) { // If isn't a null...

    try { //Trying to delete cache of the command
      delete require.cache[require.resolve(`./${args[0]}.js`)];
      message.channel.send({
        embed: {
          "color": 0x22ff22,
          "timestamp": "1337-01-01T02:28:00",
          "footer": {
            "text": message + ""
          },
          "description": "Command **``" + args[0] + "``** successfully reloaded",
          "title": "Success"
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime);
        }
      });
    } catch (e) {
      return message.channel.send({
        embed: {
          "color": 0xff2222,
          "timestamp": "1337-01-01T02:28:00",
          "footer": {
            "text": message + ""
          },
          "description": "Command ``**" + args[0] + "**`` haven't restarted",
          "title": "Error"
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime);
        }
      });
    }
  } else {
    message.channel.send({
      embed: {
        "color": 0xff2222,
        "timestamp": "1337-01-01T02:28:00",
        "footer": {
          "text": message + ""
        },
        "description": 'Enter command',
        "title": "Error"
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }
}