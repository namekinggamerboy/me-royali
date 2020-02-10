exports.run = async (client, message, args) => {
  var user = message.mentions.members.first(); //User
  var roleName = args.splice(2).join(' ');
  var role = message.guild.roles.find('name', roleName); //Role Search
  var errors = [
    "What a nice error...",
    "URGHHH ERRORS OH YES",
    "FUCK ERRORS",
    "ERROR GOT A CAMERA"
  ];

  var userErr = [
    "i need a user, hey... :confused:",
    "specify user pls :confused:",
    "i need my fucking uSER tO giVE hIm A FUCKING ROOOOOOOLEEEEE! :japanese_goblin:"
  ];

  var roleErr = [
    "specify role pls :confused:",
    "i neEd My FUCkInG rOLE!!! :japanese_goblin:"
  ];

  var already = [
    "wait, user already have this role!",
    "heeey user already have this!",
    "i think you didn't know it but user already has a role!"
  ];
  var alreadyNo = [
    "wait, user have\'t this role!",
    "heeey user don\'t have this!",
    "i think you didn't know it but user haven\'t a role!"
  ];

  if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("you do not have permissions, haha")

  switch (args[0]) {
    case 'add':
      if (!user) return message.reply(userErr[Math.floor((Math.random() * userErr.length))]); // I need User
      if (!roleName) return message.reply(roleErr[Math.floor((Math.random() * roleErr.length))]); //I need roleName
      if (role == null) role = message.mentions.roles.first();
      if (role == null) return message.reply("i can\'t find a role... :persevere:");
      if (user.roles.has(role.id)) return message.reply(already[Math.floor((Math.random() * already.length))]); //Already have role

      user.addRole(role).then(() => message.reply('Gave :ok_hand:')).catch((err) => message.reply(errors[Math.floor((Math.random() * errors.length))]).then(() => console.log(err)));
      break;
    case 'remove':
      if (!user) return message.reply(userErr[Math.floor((Math.random() * userErr.length))]); // I need User
      if (!roleName) return message.reply(roleErr[Math.floor((Math.random() * roleErr.length))]); //I need roleName
      if (role == null) role = message.mentions.roles.first();
      if (role == null) return message.reply("i can\'t find a role... :persevere:");
      if (!user.roles.has(role.id)) return message.reply(alreadyNo[Math.floor((Math.random() * alreadyNo.length))]);

      user.removeRole(role).then(() => message.reply('Back to papa :ok_hand:')).catch((err) => message.reply(errors[Math.floor((Math.random() * errors.length))]).then(() => console.log(err)));
      break;
    default:
      message.channel.send({
        embed: {
          "description": 'You should use that like \`role <add>|<remove> <user> <role>\`',
          "color": 0xff2222
        }
      });
  }
}