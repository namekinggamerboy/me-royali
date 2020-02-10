var fs = require('fs');//FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  
const emoji = message.guild.emojis.find(emoji => emoji.name === `${args.join("")}`);

  
  if (args.length == 0) return message.channel.send({
    embed: {
      "description": "USE ?idemoji <EMOJI NAME>",
      "color": 0xff2222,
      "title": "Error"
    }
  });

  
  message.channel.send({embed: {
    title: "ID EMOJI",
       description: `**emoji NAME :** ${emoji.name}\n **animated emoji :** ${emoji.animated}\n**emoji id:**`+"`"+`${emoji.id}`+"`"+`\n**emoji create:** ${emoji.createdAt}\n**emoji add in server:**${emoji.guild}\n**emoji preview :** ${emoji}\n**emoji url:**${emoji.url}\n**⏬emoji full id**⏬`,
    thumbnail: {
		url: `${emoji.url}`,
	},
    color: 0x00FFFF,
    footer: { 
      text: `${emoji}`
            }
      }}).then(function (message) {
          message.react(emoji.id)
  });
    }
  
