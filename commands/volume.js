var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require('discord.js');

exports.run = (client, message, args, ops) => {
  
  if (!message.member.hasPermission("MOVE_MEMBERS")) return message.channel.send({
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

  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send("Nothing is playing! Use `play <url>|<song>` to add song to queue").then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });
  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({
    embed: {
      "title": "You should be in same channel with me!",
      "color": 0xff2222
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });

  if (!args[0]) {
    return message.channel.send({
      embed: {
        "description": "Volume: **" + fetched.dispatcher.volume * 100 + "%**"
      }
    }).then(async msg => {
      await msg.react('➕');
      await msg.react('➖');
      
      const plusFilter = (reaction, user) => reaction.emoji.name === "➕" && user.id === message.author.id;
      const minusFilter = (reaction, user) => reaction.emoji.name === "➖" && user.id === message.author.id;
      
      const plus = msg.createReactionCollector(plusFilter, {time: 60000});
      const minus = msg.createReactionCollector(minusFilter, {time: 60000});

      plus.on("collect", r => {
        
        r.remove(message.author.id);
        
        if (fetched.dispatcher.volume + 0.25 > 2) return;
        fetched.dispatcher.setVolume(fetched.dispatcher.volume + 0.25);
        msg.edit({
          embed: {
            "description": "Volume: **" + fetched.dispatcher.volume * 100 + "%**"
          }
        });
      });
      
      minus.on("collect", r => {
        
        r.remove(message.author.id);
        
        if (fetched.dispatcher.volume - 0.25 < 0) return;
        fetched.dispatcher.setVolume(fetched.dispatcher.volume - 0.25);
        msg.edit({
          embed: {
            "description": "Volume: **" + fetched.dispatcher.volume * 100 + "%**"
          }
        });
      });
      
      plus.on("end", r => {
        msg.delete();
      });
      
    });
  }
  if (isNaN(args[0]) || args[0] > 200 || args[0] <= 0) {
    return message.channel.send({
      embed: {
        "title": "Enter number between 1 and 200",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }
  if (args[0] > config[message.guild.id].maxVolume) {
    return message.channel.send({
      embed: {
        "title": "Enter value that smaller than `maxVolume` - " + config[message.guild.id].maxVolume + "%",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }

  fetched.dispatcher.setVolume(args[0] / 100);

  message.channel.send({
    embed: {
      "title": "Now volume: " + args[0] + "%"
    }
  }).then(msg => {
    if (config[message.guild.id].delete == 'true') {
      msg.delete(config[message.guild.id].deleteTime);
    }
  });

}