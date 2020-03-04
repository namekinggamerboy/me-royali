const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = async (client, message, args, ops) => { //Collecting info about command
  
  if (config[message.guild.id].djonly == true) {
    if (!message.member.roles.some(r=>config[message.guild.id].djroles.includes(r.id))) return message.channel.send({ 
      embed: {
        "title": "Error", 
        "description": "On this server DJOnly mode is turned on\nYou don't have any DJ role, so you can't play songs.\n*To see list of DJ roles, use `" + config[message.guild.id].prefix + "dj`*", 
      } 
    });
  }
  
  var song = args[0];
  config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
  var streamOptions = {
    seek: 0,
    volume: config[message.guild.id].volume / 100
  };

  if (!message.member.voice.channel) {
    return message.channel.send({
      embed: {
        "title": "Join voice channel first!",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }
  if (!song) {
    return message.channel.send({
      embed: {
        "title": "Input URL or song name!",
        "color": 0xff2222
      }
    }).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }

  let validate = await ytdl.validateURL(song);

  if (!validate) {
    let commandFile = require('./search.js');
    return commandFile.run(client, message, args, ops);
  }

  let info = await ytdl.getInfo(song);
  let data = ops.active.get(message.guild.id) || {};

  if (!data.connection) {
    data.connection = await message.member.voice.channel.join();
  }

  if (!data.queue) {
    data.queue = [];
  }

  data.guildID = message.guild.id;

  data.queue.push({
    songTitle: info.title,
    requestAuthor: message.author,
    url: song,
    announceChannel: message.channel.id
  });

  if (!data.dispatcher) {
    play(client, ops, data, streamOptions);
  } else {
    message.channel.send(new Discord.MessageEmbed()
      .setColor(0x0ea5d3)
      .setAuthor("Suggested by " + message.author.username, message.author.avatarURL)
      .setDescription("Added to queue **" + info.title + "**")).then(msg => {
      if (config[message.guild.id].delete == 'true') {
        msg.delete(config[message.guild.id].deleteTime);
      }
    });
  }

  ops.active.set(message.guild.id, data);

}

async function play(client, ops, data, streamOptions) {

  client.channels.get(data.queue[0].announceChannel).send(new Discord.MessageEmbed()
    .setColor("0099ff")
    .setAuthor("Suggested by " + data.queue[0].requestAuthor.username, data.queue[0].requestAuthor.avatarURL)
    .setDescription("Now playing **" + data.queue[0].songTitle + "**")).then(msg => {
    if (config[data.guildID].delete == 'true') {
      msg.delete(config[data.guildID].deleteTime);
    }
  });

  data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, {
    filter: "audioonly", quality: "highestaudio"
  }), streamOptions);

  data.dispatcher.guildID = data.guildID;

  data.dispatcher.once('finish', function() {
    finish(client, ops, this);
  });

}

async function finish(client, ops, dispatcher) {

  let fetched = ops.active.get(dispatcher.guildID);
  fetched.queue.shift();

  if (fetched.queue.length > 0) {
    ops.active.set(dispatcher.guildID, fetched);
    play(client, ops, fetched);
  } else {
    fetched.dispatcher.end();
    ops.active.delete(dispatcher.guildID);
    let vc = client.guilds.get(dispatcher.guildID).me.voice.channel;
    if (vc) {
      vc.leave();
    }
  }

}