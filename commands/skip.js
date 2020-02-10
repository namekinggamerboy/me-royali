var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args, ops) => { //Collecting info about command

  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send("Сейчас ничего не играет! Используй `play <url>|<song>` чтобы поставить композицию в очередь.");
  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("Ты должен быть в одном канале с ботом!");

  var userCount = message.member.voiceChannel.members.size;
  var required = Math.ceil(userCount / 2);

  if (!fetched.queue[0].voteSkips) {
    fetched.queue[0].voteSkips = [];
  }

  if (fetched.queue[0].voteSkips.includes(message.member.id)) {
    return message.channel.send({
      embed: {
        "title": "You are already voted for skip!",
        "description": "Left: " + fetched.queue[0].voteSkips.length / required,
        "color": 0xff2222
      }
    });
  }

  fetched.queue[0].voteSkips.push(message.member.id);
  ops.active.set(message.guild.id, fetched);

  if (fetched.queue[0].voteSkips.length >= required) {
    message.channel.send({
      embed: {
        "title": "Song skipped!",
        "color": 0x22ff22
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
    if (!fetched.queue.length == 0) {
      return fetched.dispatcher.emit('finish');
    } else {
      return fetched.dispatcher.end();
    }
    ops.active.set(message.guild.id, fetched);
  }

  message.channel.send({
    embed: {
      "title": "Voted!",
      "description": "Left: " + Math.ceil(fetched.queue[0].voteSkips.length / required),
      "color": 0x22ff22
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

}