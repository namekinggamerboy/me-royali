var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args, ops) => { //Collecting info about command
  message.channel.send({
    embed: {
      "description": `Результат: **${Math.floor(Math.random() * 2) == 0 ? "орёл" : "решка"}**!`,
      "color": 11468594,
      "image": {
        "url": "https://cdn.dribbble.com/users/722835/screenshots/2434202/01coin.gif"
      }
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
}