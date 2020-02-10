var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ) => { //Collecting info about command
  const deleteCount = parseInt(args[0], 10);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "description": "Denied!",
      "color": 0xff2222,
      "title": "Error"
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });
  
  if (!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.channel.send({
      embed: {
        "title": "Enter number between 2 and 100",
        "color": 0xff2222
      }
    });

  const fetched1 = await message.channel.fetchMessages({
    limit: deleteCount
  });
  message.channel.bulkDelete(fetched1)
    .catch(error => message.reply(`Shit, errors: ${error}`));
  message.channel.send({
    embed: {
      "description": "Bot is hungry...\n**Ate messages: " + deleteCount + "**",
      "color": 16728064,
      "image": {
        "url": "https://media0.giphy.com/media/TYKOdOASPBVjW/giphy.gif"
      } //https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2Fgiphy.gif?1531841627477
    }
  }).then(msg => {
    msg.delete(5000);
  });
}