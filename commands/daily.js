const Discord = require('discord.js'); //Discord lib
const db = require('quick.db'); //DB lib
var ms = require('parse-ms'); //MS lib

exports.run = async (client, message, args) => {

  let cooldown = 8.64e+7,
    amount = 350;
  let log = client.channels.get('471603875749691393') // Logging channel

  try {
    db.fetch(`lastDaily_${message.author.id}`).then(lastDaily => {
      db.fetch(`balance_${message.guild.id}_${message.member.id}`).then(m => {
        if (m == null) {
          db.set(`balance_${message.guild.id}_${message.member.id}`, 50);
        } else if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
          
          let timeObj = ms(cooldown - (Date.now() - lastDaily));
          
          let lastDailyEmbed = new Discord.RichEmbed()
            .setAuthor("Denied")
            .setColor('#ff2222')
            .setDescription(`You need to wait before collecting daily reward again. \nTime Left: **${timeObj.hours}:${timeObj.minutes}**!`)
            .setFooter('Used by ' + message.author.tag, message.author.avatarURL);
          
          let dailyCooldown = new Discord.RichEmbed()
            .setAuthor("Denied")
            .setColor('#ff2222')
            .setDescription(`Used daily before cooldown.\nTime Left: **${timeObj.hours}:${timeObj.minutes}**!`)
            .setFooter('Used by ' + message.author.tag, message.author.avatarURL);

          message.channel.send(lastDailyEmbed);

        } else {

          db.set(`lastDaily_${message.author.id}`, Date.now());
          db.add(`balance_${message.guild.id}_${message.member.id}`, amount).then(i => {

            var embed = new Discord.RichEmbed()
              .setTitle('Daily')
              .setDescription(`Sucessfully collected **$${amount}**`)
              .setColor('#ffffff')
              .setFooter('Used by ' + message.author.tag, message.author.avatarURL)

            message.channel.send(embed);
            
            let dailyGot = new Discord.RichEmbed()
            .setAuthor("Success")
            .setColor('#22ff22')
            .setDescription("Successfuly got daily reward")
            .setFooter('Used by ' + message.author.tag, message.author.avatarURL);

          });
        }
      });
    });
  } catch (err) {
    console.log("[ERROR] When using DAILY - \n" + err)
  }

}