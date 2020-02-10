var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {

  let reasons = [
    "Hi",
    "From the heart",
    "Just because",
    "Lol unban",
    "Just be unbanned"
  ];

  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied!",
      "color": 0xff2222,
      "title": "Error"
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  const reason = args.slice(1).join(' ');
  if (!reason) {
    reason = reasons[Math.floor(Math.random() * reasons.length)];
  }
  client.unbanReason = reason;
  const user = args[0] || message.mentions.members.first();

  if (!user) return message.reply({ embed: {"title": 'Mention a user!', "color": 0xff2222} }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  message.guild.unban(user);
  message.channel.send({
    embed: {
      "title": `Successfuly unbanned <@${user}>`,
      "description": "For reason: " + reason,
      "color": 0x22ff22
    }
  });
};