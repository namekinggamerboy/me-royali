const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    let msg = await message.channel.send("Generating avatar...");

    let mentionedUser = message.mentions.users.first()|| message.author;

  let Ia = /\?size=2048$/g;
        let embed = new Discord.RichEmbed()

        .setImage(mentionedUser.displayAvatarURL)
        .setColor("#00FF00")
        .setTitle("Avatar")
        .setFooter("Searched by " + message.author.tag)
        .setDescription("Avatar: [128]("+mentionedUser.displayAvatarURL.replace(Ia, "?size=128")+")"+` | [512](${mentionedUser.displayAvatarURL.replace(Ia, "?size=512")}) | [1024](${mentionedUser.displayAvatarURL.replace(Ia, "?size=1024")}) | [2048](${mentionedUser.displayAvatarURL.replace(Ia, "?size=2048")})`);

        message.channel.send(embed)


    msg.delete();
}

module.exports.help = {
    name: "avatar"
}
