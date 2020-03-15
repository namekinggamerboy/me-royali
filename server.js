const db = require('quick.db');
const send = require('quick.hook');
db.createWebview(process.env.PASSWORD, process.env.PORT);
const points = new db.table('POINTS');
const levels = new db.table('LEVELS');
const xpl = new db.table("TOTAL_POINTS");
const Discord = require('discord.js');
const client = new Discord.Client({
  forceFetchUsers: true
});
const fs = require('fs');
try {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  } catch(ex){
    console.log("[ERROR] Config overwrited");
    var config = {}
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
const active = new Map();
const log = '684285303279583242'; // Logging channel


var ownerId = '596521432507219980';
// Init discord giveaways
const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});


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



client.on('ready', async () => { //Startup

	client.appInfo = await client.fetchApplication();
	setInterval(async () => {
		client.appInfo = await client.fetchApplication();
	}, 60000);

	require('./mm/dashboard')(client);
  console.log("Bot on!");
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
  
  const chan = client.channels.get("684285303279583242");
  
  config[guild.id] = {
    prefix: '?',
    delete: 'false',
    deleteTime: '10000',
    volume: '100',
    maxVolume: '200',
    djonly: 'false',
    djroles: [],
    levelup: 'false',
      levelupchannel: '₹₹)₹)₹)2)₹(_(₹)#)#9@)2)2)##)#)',
      levelupmessage: 'false',
        welcomeimage: 'https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png',
    welcomecolor: '#0099ff',
    welcometext: '#0099ff',
    welcomess: 'false',
      welcomechannel: 'chat'
  }
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  
  /* Welcome message */
  
  var welcome = new Discord.MessageEmbed()
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
    .setFooter("Members: " + guild.memberCount + " | Guild: " + guild.name + " | Use ?help to get help information | Official website: https://me-royal-plus.glitch.me");
  
  const channel = Promise.resolve(getDefaultChannel(guild));
  channel.then(function(ch) {
    const chan1 = client.channels.get(ch);
    chan1.send(welcome);
  });
  
  let liveLEmbed = new Discord.MessageEmbed()
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
  const chan = client.channels.get("684285303279583242");

  let liveLEmbed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Stopped Serving A Guild`)
  .setColor("#FF0000")
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Lost**: ${guild.memberCount}\n**Server owner:**${guild.owner.user.tag}`)
    chan.send(liveLEmbed);
});
/* ---- */

/* ON MESSAGE */
client.on('message', async message => { //If recieves message
  
  if (message.channel.type == "dm")return;
  
  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    config[message.guild.id] = {
      prefix: '?',
      delete: 'false',
      deleteTime: '10000',
      volume: '100',
      maxVolume: '200',
      djonly: 'false',
      djroles: [],
      levelup: 'false',
      levelupchannel: '₹₹)₹)₹)2)₹(_(₹)#)#9@)2)2)##)#)',
      levelupmessage: 'false',
          welcomeimage: 'https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png',
    welcomecolor: '#0099ff',
    welcometext: '#0099ff',
    welcomess: 'false',
      welcomechannel: 'chat'
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  
  if (config[message.guild.id] == undefined) {
    config[message.guild.id] = {
      prefix: '?',
      delete: 'false',
      deleteTime: '10000',
      volume: '100',
      maxVolume: '200',
      djonly: 'false',
      djroles: [],
      levelup: 'false',
      levelupchannel: '₹₹)₹)₹)2)₹(_(₹)#)#9@)2)2)##)#)',
      levelupmessage: 'false',
    welcomeimage: 'https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png',
    welcomecolor: '#0099ff',
    welcometext: '#0099ff',
    welcomess: 'false',
      welcomechannel: 'chat'
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  if (message.author.bot) return; //If bot
  if (message.guild.id !== "264445053596991498" && config[message.guild.id].levelup !== 'false') {
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
      if(config[message.guild.id].levelupmessage === 'true'){
const { Canvas } = require("canvas-constructor"); 
const { resolve, join } = require('path'); 
const { get }= require('snekfetch');
const superagent = require('superagent')
const { fetch } = require('node-fetch'); 
        
let chan = message.guild.channels.find(e => e.name === config[message.guild.id].levelupchannel);
if(chan === '₹₹)₹)₹)2)₹(_(₹)#)#9@)2)2)##)#)') chan = message.channel;	
        chan.send(`<@${message.author.id}>`,{embed:{title: "levelup", color: 0x00ff00, image:{ url: "https://cdn.discordapp.com/attachments/675640023273701437/682081085785636900/Discord_Achievement_Template_3.gif" }, description: `your level up to ${lvl}`}});
      }
        }
          
       )};
    });
  });
  };

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
  
  if (message.content === prefix+"nsfw") {
    message.delete(1000);
    var author = message.member;
    var role = message.guild.roles.find(e => e.name === "Hide NSFW"); //Role Search
    if (author.roles.has(role.id)) { 
      author.roles.removeRole(role).then(() => message.channel.send({ embed: {"title": "Now you will see that hell... :ok_hand:"} })).then(msg => {msg.delete(10000);});
    }
    else {
      author.roles.add(role).then(() => message.channel.send({ embed: {"title": "Now your mom won't see any hentai :ok_hand:"} })).then(msg => {msg.delete(10000);});
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
      message.channel.send().then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }

    let commandFile = require(`./commands/${cmd}.js`); //Require command from folder
    commandFile.run(client, message, args, ops); 
console.log(`${message.guild.name}/#${message.channel.name} (${message.channel.id}):${message.author.username} (${message.author.id}) ran command ${cmd}`); 
    //Pass four args into 'command'.js and run it

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

const canvas = require("discord-canvas"),
  welcomeCanvas = new canvas.Welcome();
client.on('guildMemberAdd', async member => {
    if (config[member.guild.id].welcomess === "true") {
 let avatar =  member.user.displayAvatarURL({ format: 'png', size: 2048 });
 let image = await welcomeCanvas
.setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setMemberCount(member.guild.memberCount)
  .setGuildName(member.guild.name)
  .setAvatar(avatar)
  .setColor("border", config[member.guild.id].welcomecolor)
  .setColor("username-box", config[member.guild.id].welcomecolor)
  .setColor("discriminator-box", config[member.guild.id].welcomecolor)
  .setColor("message-box", config[member.guild.id].welcomecolor)
  .setColor("title", config[member.guild.id].welcometext)
  .setColor("avatar", config[member.guild.id].welcomecolor)
.setBackground(config[member.guild.id].welcomeimage)
  .toAttachment();

let attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome.png");
 
  let chann = client.channels.find(e => e.name === config[member.guild.id].welcomechannel);
    chann.send(attachment);    
    }
  db.set(`bal_${member.guild.id}_${member.id}`, 0);
  levels.set(`${member.guild.id}_${member.id}`, 1);
  points.set(`${member.guild.id}_${member.id}`, 0);
  xpl.set(`${member.guild.id}_${member.id}`, 0); 
});

client.on('guildMemberRemove', member => {
  db.delete(`bal_${member.guild.id}_${member.id}`);
  levels.delete(`${member.guild.id}_${member.id}`);
  points.delete(`${member.guild.id}_${member.id}`);
  xpl.delete(`${member.guild.id}_${member.id}`);
});
client.on('messageUpdate', async (oldMessage, newMessage) => {

  });

client.on('message', msg => {
 let prefix = config[msg.guild.id].prefix;
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
    msg.channel.send({ embed: {
      title: "My prefix in this server is set to: "+"``"+`${prefix}`+"``\nTo reset to default execute `?reset-prefix` command!",
      color: 0x00FFFF
    }});
  };
});

const bod_api = require("bodapi.js");
const bod = new bod_api('uT3ZtT8HaMGxRnIF3Fd0meHGNPWx1w', client);

// m is optional
bod.on('posted', (m) => {
 console.log(m);
})

bod.on('error', e => {
  console.log(`Error ${e}`);
})
bod.getStats("674108575118786560").then(stats => {
 console.log(stats)
});

client.login(process.env.TOKEN);