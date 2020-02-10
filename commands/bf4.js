const request = require('request-promise-native');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args) => {
  try {
    let platform;
    let username;
    if (!['pc', 'ps4', 'xone', 'ps3', 'xbox'].includes(args[0])) return message.channel.send({
      embed: {
        "title": 'Enter platform `pc|ps4|ps3|xone|xbox`',
        "color": 0xff2222
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
    if (!args[1]) return message.channel.send({
      emebd: {
        "title": 'Enter username',
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
      url: `https://api.bf4stats.com/api/playerInfo?plat=${platform}&name=${username}&output=json`,
      json: true
    };
    let response = await request(options);

    message.channel.send({
      embed: {
        color: 0xe9ff00,
        author: {
          name: `[${response.player.tag}] ${response.player.name}`,
          url: response.player.blPlayer
        },
        title: 'Battlefield 4 - Statistics',
        description: `*Сыграно ${(response.player.timePlayed / 60 / 60).toFixed(2)} ч.*`,
        fields: [{
            name: 'Country',
            value: `${response.player.countryName}` + ` (${response.player.country})`,
            inline: true
          },
          {
            name: 'Rating',
            value: `${response.player.rank.nr} - ${response.player.rank.name}`,
            inline: true
          },
          {
            name: 'Score',
            value: `${response.player.score}`,
            inline: true
          },
          {
            name: 'Skills',
            value: `${response.stats.skill}`,
            inline: true
          },
          {
            name: 'SPM',
            value: `${(response.stats.extra.spm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'KPM',
            value: `${(response.stats.extra.kpm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Wins',
            value: `${response.stats.numWins}`,
            inline: true
          },
          {
            name: 'Losses',
            value: `${response.stats.numLosses}`,
            inline: true
          },
          {
            name: 'W/L',
            value: `${(response.stats.extra.wlr).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Kills',
            value: `${response.stats.kills}`,
            inline: true
          },
          {
            name: 'Deaths',
            value: `${response.stats.deaths}`,
            inline: true
          },
          {
            name: 'K/D',
            value: `${(response.stats.extra.kdr).toFixed(2)}`,
            inline: true
          }
        ],
        thumbnail: {
          url: 'https://rocketdock.com/images/screenshots/Battlefield4_byWar36.png'
        },
        image: {
          url: "http://g.bf4stats.com/UbNNLzr4/" + platform + "/" + username + ".png"
        },
        footer: {
          text: 'Statistics BF4 for ' + username
        }
      }
    }).catch(e => {
      console.error(e);
    });
  } catch (e) {
    if (e.response) {
      return console.error('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    console.error(e);
  }
};