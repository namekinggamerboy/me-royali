const Discord = require("discord.js");
exports.run = (client, message, args) => {

  message.channel.send({
    embed: {
      "description": `:ping_pong: **Pong!**`,
      "color": 3407679,
      "footer": {
        "icon_url": `${message.author.avatarURL}`,
        "text": `${client.ping}ms`
      }
    }
  });
}