const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
  console.log('Ping-pong-ping-pong... ');
});
app.listen(3001);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 600000);

//Libraries
const db = require('quick.db'); //Quick.db
const send = require('quick.hook'); //WebHooks lib
db.createWebview(process.env.PASSWORD, process.env.PORT); // process.env.PORT creates the webview on the default port
const points = new db.table('POINTS');
const levels = new db.table('LEVELS');
const xpl = new db.table("TOTAL_POINTS");

const Discord = require('discord.js'); //Discord library
//Creating bot
const client = new Discord.Client({
  forceFetchUsers: true
});
const fs = require('fs'); //FileSystem
try {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    console.log("[ERROR] Config overwrited");
    var config = {}
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
const active = new Map();
const log = client.channels.get('471603875749691393') // Logging channel

const serverStats = {
  guildID: '586076490588880898',
  totalUsersID: '661201675427512343',
  memberCountID: '669507020084346880',
  botCountID: '670200360044068874'
}

var ownerId = '596521432507219980'; //My ID

const getDefaultChannel = async (guild) => {
  if(guild.channels.has(guild.id))
    return guild.channels.get(guild.id)
  
  if(guild.channels.exists("name", "general"))
    return guild.channels.find("name", "general").id;
  
  return guild.channels
   .filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
   .sort((a, b) => a.position - b.position ||
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
   .first().id;
}

client.on("error", e => {
  console.log("[ERROR] " + e);
});

client.on('ready', () => { //Startup
  console.log("Bot on!");
  client.user.setUsername("JP.GAMER");
  client.user.setStatus('idle);
  client.user.setActivity(`on ${client.users.size} users | #help`, {
    type: 'WATCHING'
  });
});

client.on("disconnected", () => {
	console.log("Disconnected from Discord");
	console.log("Attempting to log in...");
	client.login(process.env.TOKEN);
});

client.on('guildCreate', guild => { // If the Bot was added on a server, proceed
  client.user.setActivity(`on ${client.users.size} users | #help`, {
    type: 'WATCHING'
  });
  
  const chan = client.channels.get("553637012457127946");
  
  config[guild.id] = {
    prefix: '#',
    delete: 'true',
    deleteTime: 10000,
    volume: 100,
    maxVolume: 200,
    djonly: false,
    djroles: [],
    levelup: false
  }
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  
  /* Welcome message */
  
  var welcome = new Discord.RichEmbed()
    .setColor(0x000000)
    .setURL("https://discord.gg/B")
    .setTitle("Joined " + guild.name + " | Click to join support server")
    .setDescription("**Well, hello, I think.**\n\nMy name is Jp.gamer, as you can see. I'm just a bot. Perfect bot. Another, same as other millions bots.\n\n")
    .addField("Prefix", `\`#\``, false)
    .addField("Auto-delete", "true", false)
    .addField("Delete time", "10s", false)
    .addField("Default volume", "100%", false)
    .addField("Max volume", "200%", false)
    .addField("Level UP messages", "false", false)
    .setFooter("Members: " + guild.memberCount + " | Guild: " + guild.name + " | Use #help to get help information | Official website: expobot.glitch.me");
  
  const channel = Promise.resolve(getDefaultChannel(guild));
  channel.then(function(ch) {
    const chan1 = client.channels.get(ch);
    chan1.send(welcome);
  });
  
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Joined A Guild`)
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Get**: ${guild.memberCount}`)
  chan.send(liveLEmbed);
  
});  

client.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
  delete config[guild.id]; // Deletes the Guild ID and Prefix
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) console.log(err)
  })
  client.user.setActivity(`on ${client.users.size} users | #help`, {
    type: 'WATCHING'
  });
  const chan = client.channels.get("471603875749691393");
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Stopped Serving A Guild`)
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Lost**: ${guild.memberCount}`)
    chan.send(liveLEmbed);
});


/* ON MESSAGE */
client.on('message', message => { //If recieves message
  
  if (message.channel.type == "dm") return;
  
  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    config[message.guild.id] = {
      prefix: '#',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  
  if (config[message.guild.id] == undefined) {
    config[message.guild.id] = {
      prefix: '#',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  if (message.author.bot) return; //If bot
  
  let xpAdd = Math.floor(Math.random() * 7) + 8;
  
  // POINT SYSTEM
  
  db.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) db.set(`balance_${message.guild.id}_${message.author.id}`, 50);
  });
  
  levels.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null || i === 0) levels.set(`${message.guild.id}_${message.author.id}`, 1);
  });
  
  points.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) points.set(`${message.guild.id}_${message.author.id}`, 0);
  });
  
  xpl.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) xpl.set(`${message.guild.id}_${message.author.id}`, 0);
  });
  
  points.add(`${message.guild.id}_${message.author.id}`, xpAdd);
  xpl.add(`${message.guild.id}_${message.author.id}`, xpAdd);
  points.fetch(`${message.guild.id}_${message.author.id}`).then(p => {
    levels.fetch(`${message.guild.id}_${message.author.id}`).then(l => {
      var xpReq = l * 300;
      if(p >= xpReq ) {
        levels.add(`${message.guild.id}_${message.author.id}`, 1);
        points.set(`${message.guild.id}_${message.author.id}`, 0);
        levels.fetch(`${message.guild.id}_${message.author.id}`, {"target": ".data"}).then(lvl => {
          if (message.guild.id !== "264445053596991498" && config[message.guild.id].levelup !== false) {
            message.channel.send({ embed: {"title": "Level Up!", "description": "Now your level - **" + lvl + "**", "color": 0x42f477} });
          }
        });
      }
    });
  });

  //END OF POINT SYSTEM
  
  var prefix = config[message.guild.id].prefix;

  let args = message.content.slice(prefix.length).trim().split(' '); //Setting-up arguments of command
  let cmd = args.shift().toLowerCase(); //LowerCase command
  
  if (message.content === "#!reset-prefix") {
    config[message.guild.id].prefix = '#';
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send({ embed: {"title": "Prefix - #", "color": 0x22ff22} });
    return;
  }
  
  if (message.content === prefix + "nsfw" && message.guild.id == "471591472311828480") {
    message.delete(1000);
    var author = message.member;
    var role = message.guild.roles.find('name', "Hide NSFW"); //Role Search
    if (author.roles.has(role.id)) { 
      author.removeRole(role).then(() => message.channel.send({ embed: {"title": "Now you will see that hell... :ok_hand:"} })).then(msg => {msg.delete(10000);});
    }
    else {
      author.addRole(role).then(() => message.channel.send({ embed: {"title": "Now your mom won't see any hentai :ok_hand:"} })).then(msg => {msg.delete(10000);});
    }
    return;
  }

  if (!message.content.startsWith(prefix)) return; //If no prefix

  //Command handler
  try {
    
    if (config[message.guild.id].delete == 'true') {
      message.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
    }
    
    let ops = { 
      ownerId: ownerId,
      active: active
    }

    if (cmd == '') {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Enter command"
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }

    let commandFile = require(`./commands/${cmd}.js`); //Require command from folder
    commandFile.run(client, message, args, ops); //Pass four args into 'command'.js and run it

  } catch (e) { //Catch errors 
    if (!message.content === "#!reset-prefix") {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Something went wrong \n" + e
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }
  }
});


client.on('guildMemberAdd', member => {
  if (member.guild.id !== serverStats.guildID) return;
  client.channels.get(serverStats.totalUsersID).setName(`🆙Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`🕵️Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`🤖Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  db.set(`balance_${member.guild.id}_${member.id}`, 50);
  levels.set(`${member.guild.id}_${member.id}`, 1);
  points.set(`${member.guild.id}_${member.id}`, 0);
  xpl.set(`${member.guild.id}_${member.id}`, 0);
  
  var userGot = new Discord.RichEmbed()
    .setColor(0x555555)
    .setDescription("User got")
    .setTitle(member.tag);
  
  send(log, userGot, {
    name: "Bot Log",
    icon: "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"
  });
  
});

client.on('guildMemberRemove', member => {
  if (member.guild.id !== serverStats.guildID) return;
  client.channels.get(serverStats.totalUsersID).setName(`🆙Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`🕵️Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`🤖Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  db.delete(`balance_${member.guild.id}_${member.id}`);
  levels.delete(`${member.guild.id}_${member.id}`);
  points.delete(`${member.guild.id}_${member.id}`);
  xpl.delete(`${member.guild.id}_${member.id}`);
  
  var userLost = new Discord.RichEmbed()
    .setColor(0x555555)
    .setDescription("User lost")
    .setTitle(member.tag);
  
  send(log, userLost, {
    name: "Bot Log",
    icon: "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"
  });
  
});


client.once('ready', () => {
console.log(`${client.user.username}`);
});

client.on("guildMemberAdd", async member => {
  let channel = member.guild.channels.get("672043081255616532");
  channel.send("<@"+member.id+">",{embed:{
    description: `Welcome To **${member.guild.name}**. Have A Great Time Here :wink:`,
    color: 0x0022ff,
    image:{
      url: "https://cdn.discordapp.com/attachments/661523269882478602/673372026437632000/PicsArt_02-02-09.09.53.png",
    }
  }});
})

//Connecting bot
client.login(process.env.TOKEN);,