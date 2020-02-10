var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require('discord.js');
const urban = require('urban');

exports.run = (client, message, args, ops) => {
  urban(args).first(json => {

    if (!json) return message.channel.send({
      embed: {
        "description": "Nothing found :sweat: ",
        "color": 0xFF2222
      }
    });

    let embed = new Discord.RichEmbed()
      .setColor(0x56aaff)
      .setDescription(json.definition)
      .addField('Example', json.example)
      .addField(`Upvotes`, json.thumbs_up, true)
      .addField(`Downvotes`, json.thumbs_down, true)
      .setFooter(`Written by ${json.author}`)
      .setTitle(json.word);

    message.channel.send(embed);

  });
}