const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  
 let argl = args.slice(1).join(" ");
  
  
  if (args.length == 1) return message.channel.send({
    embed: {
      "description": "❌use command ex.`colorrole <colorcode>(with#)or(color name)) {role name}\n**YOUR NOT ENTER ROLE NAMEor role tag**`",
      "color": 0xff2222,
      "title": "Error"
    }
  });
  
  if(!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return;
 
  let role = message.guild.roles.find(r => r.name === `${argl}`) || message.mentions.roles.first();

  let argw = args[0];
  
  if (args.length == 0) return message.channel.send({
    embed: {
      "description": "use Command : Ex. `colorrole 0099ff roletest`,`colorrole BLUE roletest`,`colorrole #0099ff @roletest`",
      "color": 0xff2222,
      "title": "Error"
    }
  }); 
 
    var color = new Discord.MessageEmbed()
    .setTitle("Done")
      .setColor(`${argw}`)
     .setDescription("YOUR "+`<@&${role.id}>`+"role color change to:"+`${argw}`);
  
  role.edit({color:argw}).then(() => message.reply(color)).catch((err) => message.reply('Unable to color change role').then(() => console.log(err)));
}