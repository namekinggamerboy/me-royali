var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => { //Collecting info about command
  message.channel.send({
    embed: {
      "title": "Prefix",
      "description": "Now prefix - `" + config[message.guild.id].prefix + "`\n*Use `#!reset-prefix` to slightly resets prefix to '#'*",
      "color": 16762675,
      "timestamp": "1337-01-01T02:28:00",
      "footer": {
        "text": message + ""
      },
      "fields": [{
        "name": `Change prefix`,
        "value": config[message.guild.id].prefix + "settings prefix <prefix>"
      }]
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });
}