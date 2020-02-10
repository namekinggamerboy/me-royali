const Discord = require('discord.js');
const {
  get
} = require('request-promise-native')
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args) => {

  let platform = "";
  let username = "";

  if (!['pc', 'xbl', 'psn'].includes(args[0])) return message.channel.send({
    embed: {
      "description": '**Please Include the platform: `!fortnite < pc | xbl | psn > <username>`**',
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  if (!args[1]) return message.channel.send({
    embed: {
      "description": '**Please Include the username: `!fortnite < pc | xbl | psn > <username>`**',
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  platform = args.shift();
  username = args.join(' ');

  let options = {
    uri: `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
    headers: {
      'TRN-Api-Key': "e56a7fca-9329-4934-a0a6-5a522d5184be",
    },
    json: true
  };

  let data = await get(options);

  if (data.lifeTimeStats == undefined) {
    return message.channel.send({
      embed: {
        "description": "User not found",
        "color": 0xff2222
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  }

  let stats = data.lifeTimeStats.map(stat => {
    return {
      name: stat.key,
      value: stat.value,
      inline: true
    };
  });

  message.channel.send({
    embed: {
      "fields": stats,
      author: {
        name: `Stats for ${data.epicUserHandle}`
      },
      "color": 0xffffff
    }
  });
};