const Discord = require('discord.js');
module.exports.run = async (bot, message, args) => {
// inside a command, event listener, etc.
var facts = ["clan", "sunrise", "mosaic", "alien-glow", "blended", "graffiti"]
var fact = Math.floor(Math.random() * facts.length);
  
  
const photo = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Text to photo')
.setImage(`https://flamingtext.com/net-fu/proxy_form.cgi?script=`+ facts[fact] +`-logo&text=${args.join("")}+&_loc=generate&imageoutput=true`);

message.channel.send(photo);
}
