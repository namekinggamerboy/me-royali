const Discord = require('discord.js');
module.exports.run = async (bot, message, args) => {
// inside a command, event listener, etc.

  
  let question = args.join(" ");
        if(!question){
            return message.channel.send("enter your.web link or search link");
        }
        question = question.replace(/[' '_]/g, "+");
        await message.channel.send({embed:{title: `your sreach   |`+args.join(" "), description:`click and go web:-[Click Me](http://lmgtfy.com/?q=${question})`, color: 0x00FF00}});
        message.delete();
}
