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
const log = client.channels.get('635051074809626657') // Logging channel

const serverStats = {
  guildID: '635051074809626657',
  totalUsersID: '645928693021016084',
  memberCountID: '645276352626425918',
  botCountID: '645247568590405662'
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
     client.fromString(a.id).sub(client.fromString(b.id)).toNumber())
   .first().id;
}

client.on("error", e => {
  console.log("[ERROR] " + e);
});

client.on('ready', () => { //Startup
  console.log("Bot on!");
  client.user.setUsername("ME ROYAL PLUS");
  client.user.setStatus('dnd');
  client.user.setActivity(`on ${client.users.size} users | ?help`, {
    type: 'WATCHING'
  });
});

client.on("disconnected", () => {
	console.log("Disconnected from Discord");
	console.log("Attempting to log in...");
	client.login(process.env.TOKEN);
});

client.on('guildCreate', guild => { // If the Bot was added on a server, proceed
  client.user.setActivity(`on ${client.users.size} users | ?help`, {
    type: 'WATCHING'
  });
  
  const chan = client.channels.get("647318983649001472");
  
  config[guild.id] = {
    prefix: '?',
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
    .setColor(0x00FFFF)
.setURL("https://discord.gg/KmngEup")
    .setTitle("Joined " + guild.name + " | Click to join support server")
    .setDescription("**Well, hello, I think.**\n\nMy name is me royal Plus, as you can see. I'm just a bot. Perfect bot. Another, same as other millions bots.\n\n**")
    .addField("Prefix", `\`?\``, false)
    .addField("Auto-delete", "true", false)
    .addField("Delete time", "10s", false)
    .addField("Default volume", "100%", false)
    .addField("Max volume", "200%", false)
    .addField("Level UP messages", "false", false)
    .setFooter("Members: " + guild.memberCount + " | Guild: " + guild.name + " | Use ?help to get help information | Official website: https://me-royal.glitch.me");
  
  const channel = Promise.resolve(getDefaultChannel(guild));
  channel.then(function(ch) {
    const chan1 = client.channels.get(ch);
    chan1.send(welcome);
  });
  
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
  .setColor("#00FF00")
    .setTitle(`Joined A Guild`)
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Get**: ${guild.memberCount}\n**server owner**: ${guild.owner.user.tag}`)
  chan.send(liveLEmbed);
  
});  

client.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
  delete config[guild.id]; // Deletes the Guild ID and Prefix
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) console.log(err)
  })
  client.user.setActivity(`on ${client.users.size} users | ?help`, {
    type: 'WATCHING'
  });
  const chan = client.channels.get("649817049471778836");

  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Stopped Serving A Guild`)
  .setColor("#FF0000")
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Lost**: ${guild.memberCount}\n**Server owner:**${guild.owner.user.tag}`)
    chan.send(liveLEmbed);
});


/* ON MESSAGE */
client.on('message', message => { //If recieves message
  
  if (message.channel.type == "dm") return;
  
  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    config[message.guild.id] = {
      prefix: '?',
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
      prefix: '?',
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
    if (i == null) db.set(`balance_${message.guild.id}_${message.author.id}`, 100);
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
		message.reply({ embed: {"title": "Level Up!", "description": "Now your level - **" + lvl + "**", "color": 0x42f477} });
          }
        });
      }
    });
  });

  //END OF POINT SYSTEM
  
  var prefix = config[message.guild.id].prefix;

  let args = message.content.slice(prefix.length).trim().split(' '); //Setting-up arguments of command
  let cmd = args.shift().toLowerCase(); //LowerCase command
  
  if (message.content === "?reset-prefix") {
    config[message.guild.id].prefix = '?';
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send({ embed: {"title": "Prefix - ?", "color": 0x22ff22} });
    return;
  }
  
  if (message.content === prefix+ "nsfw" && message.guild.id == "635051074809626657") {
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
    if (!message.content === "?reset-prefix") {
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
  client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  db.set(`bal_${member.guild.id}_${member.id}`, 0);
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
  client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  db.delete(`bal_${member.guild.id}_${member.id}`);
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

const { Canvas } = require("canvas-constructor"); 
const { resolve, join } = require('path'); 
const { get }= require('snekfetch');
const superagent = require('superagent')
const { fetch } = require('node-fetch');
client.once('ready', () => {
	console.log('Ready!');
});

client.on("guildMemberAdd", async member => {
  

  
  async function createCanvas() {
  
    let name = member.user.username;
let imageUrlPhoto = /\?size=2048$/g;
  
  var server = records.get(member.guild.id);
	if(server.image != undefined && server.message != undefined) {
    
        var msD = server.message.replace('{user}', name)
.replace('{server}', member.guild.name)
.replace('{membercount}',member.guild.memberCount);  
    
let image = `${server.image}`;
let aaa = member.user.displayAvatarURL; 
    
let {body: background} = await superagent.get(image);  
let {body: avatar} = await superagent.get(aaa);    

  return new Canvas(934, 282) 
    .setColor('#FFFFFF')
    .setTextFont("bold 30px Arial") 
    .addImage(background, 0, 0, 934, 282)
       .addText(msD, 320, 150)
.addRoundImage(avatar, 110, 50, 200, 200, 100)
    .toBufferAsync(); 
  }}
  var server = records.get(member.guild.id);
	if(server.join != undefined && server.channel != undefined) {
    		var msg = server.join.replace('{user}', '<@' + member.id + '>')
.replace('{server}', member.guild.name)
.replace('{membercount}',member.guild.memberCount);
    
    let channel = member.guild.channels.find("name", server.channel);
  channel.send(msg,
{files: [{
      attachment: await createCanvas(), 
    name: "welcome.png"

}]
   })
  }
});

const records = require('./commands/records.js');
const cmd = require('./commands/executor.js');
const dir = 'servers.json';


//Setup
client.on('guildCreate', function(guild) {
	records.add(guild.id);
});

client.on('guildDelete', function(guild) {
	records.remove(guild.id);
});

client.on('guildMemberAdd', function(member) {
	var server = records.get(member.guild.id);
	if(server.join != undefined && server.channel != undefined) {
    

    member.guild.channels.find("name", server.channel).send("");

}
	if(server.role != undefined) {
		var role = member.guild.roles.find("name", server.role);
 if(role != undefined) {
			member.addRole(role).catch(error => {
				member.guild.owner.send("Error on **" + member.guild.name + "**: no parmission bot reason high role select or not parmission");
			});
		}
	}
});

client.on('message', msg => {cmd.on(msg);});
client.on('message', msg => {
 let prefix = config[msg.guild.id].prefix;
  if (msg.content === '<@643811842661285888>') {
    msg.channel.send({ embed: {
      title: "`MY NAME` : "+`${client.user.username}`+" , my default prefix: `?` , Custom Server prefix: "+"``"+`${prefix}`+"``",
      color: 0x00FFFF
    }});
  }
});
client.login(process.env.TOKEN);
