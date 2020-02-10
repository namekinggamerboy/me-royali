var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require("discord.js");

exports.run = (client, message, args) => {

  if (args.length == 0) return message.channel.send({
    embed: {
      "description": "Enter photo url",
      "color": 0xff2222,
      "title": "Error"
    }
  });
  
  message.channel.send({
    embed: {
      "image":{
        "url": `${args.join(" ")}`,
              },
      "color": 0x0022ff
    }
  });

}