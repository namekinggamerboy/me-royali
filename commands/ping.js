const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
let pings = JSON.parse(fs.readFileSync("./pings.json", "utf8")); //Config file

exports.run = (client, message, args) => { //Collecting info about command

  if (!pings[message.guild.id]) {
    pings[message.guild.id] = 1;
    fs.writeFile("./pings.json", JSON.stringify(pings, null, 2), (err) => {
      if (err) return console.log(err)
    });
  }

  var resp = "***" + pings[message.guild.id] / 10 + " times***";

  if (pings[message.guild.id] / 10 == 1) resp = "***" + pings[message.guild.id] / 10 + " time***"

  if (Number.isInteger(pings[message.guild.id] / 10)) {
    return message.channel.send({
      embed: {
        "description": resp,
        "color": 3407679,
        "footer": {
          "icon_url": `${message.author.avatarURL}`,
          "text": `${client.ping}ms`
        },
        "image": {
          "url": "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2Fimage.jpg?1532271294182"
        }
      }
    }).then(msg => {
      pings[message.guild.id]++;
      fs.writeFile("./pings.json", JSON.stringify(pings, null, 2), (err) => {
        if (err) return console.log(err)
      });
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  } //Pong!

  message.channel.send({
    embed: {
      "description": `:ping_pong: **Pong!**`,
      "color": 3407679,
      "footer": {
        "icon_url": `${message.author.avatarURL}`,
        "text": `${client.ping}ms`
      }
    }
  }).then(msg => {
    pings[message.guild.id]++;
    fs.writeFile("./pings.json", JSON.stringify(pings, null, 2), (err) => {
      if (err) return console.log(err)
    });
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  }); //Pong!
}