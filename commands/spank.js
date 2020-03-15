const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const Discord = require("discord.js"); // This is to send the image via discord.
const fetch = require("node-fetch");

exports.run = async (client, message, args) => {
  let i = message.mentions.users.first()||client.user;
    const link = i.displayAvatarURL({ format: 'png', size: 2048 });
const result = await fetch(link);
const avatar = await result.buffer();

  const aa = "https://raw.githubusercontent.com/IamTails/Dank-Memer-1/master/src/assets/imgen/spank.jpg";
  const rr = await fetch(aa);
  const ad = await rr.buffer();
  
  const lin = message.author.displayAvatarURL({ format: 'png', size: 2048 });
const resul = await fetch(lin);
const avata = await resul.buffer();
 
  
  message.channel.send(
    `<@${message.author.id}> spank to <@${i.id}>`,
    new Discord.MessageAttachment(
   new Canvas(500, 500)
.addImage(ad, 0, 0, 500, 500)
.save()
.addRoundImage(avata, 220, 5, 160, 160, 80)
.save()
.addRoundImage(avatar, 340, 210, 140, 140, 70)
        .toBuffer(),
      "rank.png"    )
  );
  
}