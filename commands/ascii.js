var figlet = require('figlet');
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {
  var maxLen = 14 // You can modify the max characters here

  if (args.join(' ').length > maxLen) return message.channel.send({
    embed: {
      "title": 'It is better not to exceed the number of characters greater than 14, otherwise on mobile devices there may be distortions!',
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  if (!args[0]) return message.channel.send({
    embed: {
      "title": 'Enter text',
      "color": 0xff2222
    }
  });

  figlet(`${args.join(' ')}`, function(err, data) {
    if (err) {
      console.log('О-ошибка...');
      console.dir(err);
      return;
    }

    message.channel.send(`${data}`, {
      code: 'AsciiArt'
    });
  });
}