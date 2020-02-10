const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args) => {

  if (args.length == 0) {
    return message.channel.send({
      embed: {
        "title": "Help",
        "fields": [{
            "name": "Simple Poll (Yes/No)",
            "value": "`poll` - this menu\n`poll <time> <question>` - poll with timed end. Time should be entered in seconds, default - 1 hour"
          },
          {
            "name": "Multi-choice Poll",
            "value": "`mpoll <time> <question> <a1>...<a9>` - poll with multi-choice and timed end. Time should be entered in seconds, default - 1 hour"
          }
        ],
        "color": 3264944,
        "footer": {
          "text": message + ""
        }
      }
    });
  }

  let time1 = args.shift();
  let question = args.join(" ");

  if (!isNaN(time1)) {
    time1 = time1 * 1000;
  } else {
    question = time1 + " " + question;
    time1 = 3600 * 1000;
  }

  message.channel.send({
    embed: {
      "title": "Опрос:",
      "description": question + "",
      "color": "3264944",
      "footer": {
        "text": "Опрос создал " + message.author.username,
        "icon_url": message.author.avatarURL
      }
    }
  }).then(async function(msg) {
    await msg.react('👍');
    await msg.react('👎');

    var reactions = await msg.awaitReactions(reaction => reaction.emoji.name === '👍' || reaction.emoji.name === '👎', {
      time: time1
    });

    var yes = "Most voted 👍";
    var no = "Most voted 👎";
    var tie = "Tie!";
    var end;

    if (msg.reactions.get('👍').count - 1 > msg.reactions.get('👎').count - 1) {
      end = yes
    } else if (msg.reactions.get('👍').count - 1 < msg.reactions.get('👎').count - 1) {
      end = no
    } else if (msg.reactions.get('👍').count - 1 == msg.reactions.get('👎').count - 1) {
      end = tie
    }

    msg.channel.send({
      embed: {
        "title": question,
        "description": `**Poll ended!** \n\n👍: ${msg.reactions.get('👍').count-1}\n***----------***\n👎: ${msg.reactions.get('👎').count-1}`,
        "color": 3264944,
        "footer": {
          "text": end
        }
      }
    })
  });

}