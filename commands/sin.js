exports.run = (client, message, args) => {


    const setChannelID = message.content.split(' ');
   
  
client.on("message", guild => {
  let channels = guild.channels.filter(
    channel =>
      channel.type === "text" &&
      channel
        .permissionsFor(guild.members.get(client.user.id))
        .has("SEND_MESSAGES")
  );
  if (channels.size > 0) channels.first().send("");
  
  
})
let guild = client.guilds.get(args.join(""));
if (!guild) return message.reply("The bot isn't in the guild with this ID.");

let invitechannels = guild.channels.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))
if(!invitechannels) return message.channel.send('No Channels found with permissions to create Invite in!')

invitechannels.random().createInvite()
   .then(invite=> message.channel.send('Found Invite:\nhttps://discord.gg/' + invite.code))
  }
