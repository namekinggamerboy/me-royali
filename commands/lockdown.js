const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (client, message, args) => {
    if(!client.lockit) client.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['relase', 'unlock'];
    if(!time) return message.channel.send({embed:{title: "<:noyes:662160739603316764> enter time",description:'You must set a duration for the lockdown!⏳', color: 0xFF0000}})

    if(validUnlocks.includes(time)) {
        message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: false
        }).then(() => {
            message.channel.sendMessage({embed:{
  title: "<:yesk:662160618182410260>channel lockdown",
 description: `🔒time:  **${ms(ms(time), { long:true})}**\nchannel:<#${message.channel.id}>`,
              color: 0x00FF00
            }});
            clearTimeout(client.lockit[message.channel.id]);
            delete client.lockit[message.channel.id];
        }).catch(error => {
            console.log(error);
        });
    } else {
        message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: false
        }).then(() => {
            message.channel.sendMessage({embed:{
  title: "<:yesk:662160618182410260>channel lockdown",
 description: `🔒time: **${ms(ms(time), { long:true})}**\nchannel:<#${message.channel.id}>`,
              color: 0x00FF00
            }}).then(() => {
                client.lockit[message.channel.id] = setTimeout(() => {
                    message.channel.overwritePermissions(message.guild.id, {
                        SEND_MESSAGES: false
                    }).then(message.channel.sendMessage({embed:{title:"<:yesk:662160618182410260>now channel unlock",description:"🔓"+`channel:<#${message.channel.id}>`, color: 0x00FF00}})).catch(console.error);
                    delete client.lockit[message.channel.id];
                }, ms(time));
            }).catch(error => {
                console.log(error)
            })
        })
    }
}