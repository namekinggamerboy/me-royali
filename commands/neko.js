const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const {
  get
} = require('request-promise-native');

exports.run = (client, message, args) => {

  const options = {
    url: 'https://nekos.life/api/neko',
    json: true
  }

  const waitMessage = new Discord.RichEmbed()
    .setColor(0x999999)
    .setDescription("Catching nekos...")

  message.channel.send(waitMessage).then(msg => {

    get(options).then(body => {
      return msg.edit({
        embed: {
          title: `:eyes: Neko`,
          image: {
            url: body.neko
          },
          "color": 0xffffff
        }
      })
    }).catch(error => {
      return msg.edit({
        title: `No nekos for ${message.author.username} today :tired_face: `,
        description: `\`\`\`js\n${error}\`\`\``,
      })
    })
  });

}