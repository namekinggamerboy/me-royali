const ms = require('ms');
const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
   if(message.auuthor.id === "") {if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }

    // Giveaway channel
    let giveawayChannel = message.channel;
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: You have to mention a valid channel!');
    }

    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!');
    }

    // Number of winners
    let giveawayNumberWinners = args[1];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(2).join(' ');
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
        // Messages
        messages: {
giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
				giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
				timeRemaining: "Time remaining: **{duration}** !",
				inviteToParticipate: "React with 🎉 to participate!",
				winMessage: "Congratulations, {winners} ! You won **{prize}** !",
				embedFooter: "Giveaways",
				noWinner: "Giveaway cancelled, no valid participation.",
				winners: "winner(s)",
				endedAt: "End at",
				units: { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days"
               }
        }
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);
                                 }
}