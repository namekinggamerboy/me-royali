const ms = require('ms');
const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: You have to mention a valid channel!');
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: You have to specify a valid prize!');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: message.author.tag,
        // Messages
        messages: {
            giveaway: "<a:ha:635689659912945674><a:ha:635689659912945674>**GIVEAWAY** <a:ha:635689659912945674><a:ha:635689659912945674>",
            giveawayEnded: "<a:ha:635689659912945674> **GIVEAWAY ENDED** <a:ha:635689659912945674><a:ha:635689659912945674>",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with <a:ha:635689659912945674> to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by: {user}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);

}