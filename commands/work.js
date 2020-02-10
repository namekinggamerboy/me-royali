const Discord = require('discord.js'); //Discord lib
const db = require('quick.db'); //DB lib
var currencyFormatter = require('currency-formatter'); //For currency
var ms = require('parse-ms'); //MS lib

exports.run = async (client, message, args) => {

  try {
    let log = client.channels.get('471603875749691393') // Logging channel
    let cooldown = 3.6e+6; //1 hour in ms
    let amount = Math.floor((Math.random() * 100) + 100); // Paid
    let workplace = ["Mail", "Restaurant", "Market", "ICT", "Taxi"] // Places to work
    let workDaily = await db.fetch(`workDaily_${message.author.id}`) // Fetching the time when work is available.
    let result = Math.floor((Math.random() * workplace.length)) /* Random place */
    let timeObj = ms(cooldown - (Date.now() - workDaily)) // Left

    try {

      db.fetch(`balance_${message.guild.id}_${message.author.id}`).then(rm => { // Is balance valid
        if (rm == null || 0 || undefined) {
          db.set(`balance_${message.guild.id}_${message.author.id}`, 50)
        } // Vipe if isn't a valid number
        
        else if (workDaily !== null && cooldown - (Date.now() - workDaily) > 0) { /* If already worked */

          let workDailyEmbed = new Discord.RichEmbed()
            .setAuthor(`Cooldown`, message.author.displayAvatarURL)
            .setColor(0xff2222)
            .setDescription(`**${message.author.tag}** just worked for 6 hours!\n*You require rest for* **${timeObj.hours}h and ${timeObj.minutes}m**`)

          message.channel.send(workDailyEmbed);

        } else if (`${result}` == "0") { /* First place */

          db.set(`workDaily_${message.author.id}`, Date.now()); // Now time

          db.add(`balance_${message.guild.id}_${message.author.id}`, amount).then(i => {

            let dailyEmbed = new Discord.RichEmbed()
              .setAuthor(`${message.author.tag} has finished sorting letters`, message.author.displayAvatarURL)
              .setColor(0xf4aa42)
              .addField(`You've been payed for your shift,`, `You got paid: ${currencyFormatter.format(amount, { code: 'USD' })}`)
              .setFooter("Worked at " + workplace[result]);

            message.channel.send(dailyEmbed);

          });

        } else if (`${result}` == "1") { /* Second place */

          db.set(`workDaily_${message.author.id}`, Date.now()); // Now time

          db.add(`balance_${message.guild.id}_${message.author.id}`, amount).then(i => {

            let dailyEmbed = new Discord.RichEmbed()
              .setAuthor(`${message.author.tag} has finished washing dishes`, message.author.displayAvatarURL)
              .setColor(0xf4aa42)
              .addField(`You've been payed for your shift,`, `You got paid: ${currencyFormatter.format(amount, { code: 'USD' })}`)
              .setFooter("Worked at " + workplace[result]);

            message.channel.send(dailyEmbed);
  
          });

        } else if (`${result}` == "2") { /* Third place */

          db.set(`workDaily_${message.author.id}`, Date.now()); // Now time

          db.add(`balance_${message.guild.id}_${message.author.id}`, amount).then(i => {

            let dailyEmbed = new Discord.RichEmbed()
              .setAuthor(`${message.author.tag} has finished selling products`, message.author.displayAvatarURL)
              .setColor(0xf4aa42)
              .addField(`You've been payed for your shift,`, `You got paid: ${currencyFormatter.format(amount, { code: 'USD' })}`)
              .setFooter("Worked at " + workplace[result]);

            message.channel.send(dailyEmbed);
            
          });

        } else if (`${result}` == "3") { /* Fourth place */

          db.set(`workDaily_${message.author.id}`, Date.now()); // Now time

          db.add(`balance_${message.guild.id}_${message.author.id}`, amount).then(i => {

            let dailyEmbed = new Discord.RichEmbed()
              .setAuthor(`${message.author.tag} has finished working with clients`, message.author.displayAvatarURL)
              .setColor(0xf4aa42)
              .addField(`You've been payed for your shift,`, `You got paid: ${currencyFormatter.format(amount, { code: 'USD' })}`)
              .setFooter("Worked at " + workplace[result]);

            message.channel.send(dailyEmbed);

          });

        } else if (`${result}` == "4") { /* Fifth place */

          db.set(`workDaily_${message.author.id}`, Date.now()); // Now time

          db.add(`balance_${message.guild.id}_${message.author.id}`, amount).then(i => {

            let dailyEmbed = new Discord.RichEmbed()
              .setAuthor(`${message.author.tag} has finished driving a taxi`, message.author.displayAvatarURL)
              .setColor(0xf4aa42)
              .addField(`You've been payed for your shift,`, `You got paid: ${currencyFormatter.format(amount, { code: 'USD' })}`)
              .setFooter("Worked at " + workplace[result]);

            message.channel.send(dailyEmbed);

          });

        } else {
          message.channel.send({
            embed: {
              "title": "Critical error when trying to get place",
              "color": 0xff2222
            }
          })
        }

      });
    } catch (err) {
      console.log("[ERROR] When working at " + result + "place\n" + err);
    }
  } catch (err) {
    console.log("[ERROR] WORK: \n" + err);
  }
}