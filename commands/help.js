var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
let commandsFile = JSON.parse(fs.readFileSync("./cmd.json", "utf8"));
const Discord = require('discord.js');

exports.run = (client, message, args) => { //Collecting info about command
  var pref = conf[message.guild.id].prefix; //Prefix
  var cmdFound = 0; //Found commands

  var help = new Discord.RichEmbed() //Embed with help
    .setColor(0xf4f142)
  var help2 = new Discord.RichEmbed() //Embed with help
    .setColor(0xf4f142)

  if (args.length == 0) { // If no args
    for (var i in commandsFile) { // In commandsFile
      if (commandsFile[i].group === "User") { // If type is User
        if (cmdFound >= 25) {
          cmdFound++; //++Commands found
          help2.addField(commandsFile[i].name, `**Description:** ${commandsFile[i].desc}\n**Usage:** \`\`${pref + commandsFile[i].usage}\`\``); //Adding fields with help
        } else {
          cmdFound++; //++Commands found
          help.addField(commandsFile[i].name, `**Description:** ${commandsFile[i].desc}\n**Usage:** \`\`${pref + commandsFile[i].usage}\`\``); //Adding fields with help to another embed
        }
      }
    }
    
    help.setDescription(`**${cmdFound} commands found** - <> is required, () is optional`) //Desc

    if (cmdFound >= 25) {
      help2.setFooter(`Now showing only user commands. To view another group do ${pref}help (group|command)`); //Footer
    } else {
      help.setFooter(`Now showing only user commands. To view another group do ${pref}help (group|command)`); //Footer
    }
    
    message.author.send(help) //Sending to author
    if (cmdFound >= 25) {
      message.author.send(help2) //Sending to author
    }
    message.channel.send({
      embed: {
        "description": "Sent you DM with help :kissing_heart:",
        "color": 5164111
      }
    }).then(msg => { // Success msg
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  } //IF NO ARGS
  else if (args.join(" ") === "groups") {

    var groups = "";

    for (var i in commandsFile) {
      if (!groups.includes(commandsFile[i].group)) {
        groups += `${commandsFile[i].group}\n`
      }
    }

    message.channel.send({
      embed: {
        "description": `**${groups}**`,
        "title": "Groups",
        "color": 5164111,
        "footer": {
          "text": message + ""
        }
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  } else {
    var groupFound = "";
    var cmdFound = 0;
    var embed2 = new Discord.RichEmbed()
      .setColor(0xf4f142);

    for (let i in commandsFile) {
      if (args.join(" ").trim() === commandsFile[i].group) {
        groupFound = commandsFile[i].group;
        break;
      }
    }

    if (groupFound != "") {
      for (var c in commandsFile) {
        if (commandsFile[c].group === groupFound) {
          cmdFound++;
          embed2.addField(`${commandsFile[c].name}`, `**Description:** ${commandsFile[c].desc}\n**Usage:** ${pref + commandsFile[c].usage}`)
        }
      }

      embed2.setFooter(`Now showing only ${groupFound} commands. To view another group do ${pref}help (group|command)`);
      embed2.setDescription(`**${cmdFound} commands found** - <> is required, () is optional`);

      message.author.send(embed2)
      message.channel.send({
        embed: {
          "description": "Sent you DM with help :kissing_heart:",
          "color": 5164111
        }
      }).then(msg => {
        if (conf[message.guild.id].delete == 'true') {
          msg.delete(conf[message.guild.id].deleteTime);
        }
      });
      return;
    }

    var commandFound = '';
    var commandDesc = '';
    var commandUsage = '';
    var commandGroup = '';

    for (var i in commandsFile) {
      if (args.join(" ").trim().toLowerCase() === commandsFile[i].name.toLowerCase()) {
        commandFound = commandsFile[i].name;
        commandDesc = commandsFile[i].desc;
        commandUsage = commandsFile[i].usage;
        commandGroup = commandsFile[i].group;
        break;
      }
    }

    if (commandFound === '') {
      return message.channel.send({
        embed: {
          "description": "Incorrect group or command",
          "title": "Error",
          "color": 0xFF2222,
          "footer": {
            "text": message + ""
          }
        }
      }).then(msg => {
        if (conf[message.guild.id].delete == 'true') {
          msg.delete(conf[message.guild.id].deleteTime);
        }
      });
    }

    message.channel.send({
      embed: {
        "title": "<> is required, () is optional",
        "fields": [{
          "name": commandFound,
          "value": `**Description:** ${commandDesc}\n**Usage:** ${commandUsage}\n**Group:** ${commandGroup}`
        }],
        "color": 5164111
      }
    }).then(msg => { // Success msg
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  }
}