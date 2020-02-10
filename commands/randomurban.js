const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const urban = require("urban");

exports.run = (client, message, args, ops) => { //Collecting info about command

  urban.random().first(json => {

    if (!json) return message.channel.send({
      embed: {
        "description": "Nothing found :sweat: ",
        "color": 0xFF2222
      }
    });

    let embed = new Discord.RichEmbed()
      .setColor(0x42f4cb)
      .setDescription(json.definition)
      .addField('Example', json.example)
      .addField(`Upvotes`, json.thumbs_up, true)
      .addField(`Downvotes`, json.thumbs_down, true)
      .setFooter(`Written by ${json.author}`)
      .setTitle(json.word);

    message.channel.send(embed);

  });

}