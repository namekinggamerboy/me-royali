const tts = require('google-tts-api');
const snekfetch = require('snekfetch');

exports.run = async (client, message, args) => {

  let text = message.content.split(" ").slice(1).join(" ");
  if (!text) return message.channel.send('Please enter a text to tts!')

  const voiceChannel = message.member.voice;
  if (!voiceChannel) return message.channel.send('**Please be in a voice channel first!**');
  
  if (!client.voiceConnections.get(message.channel.guild.id)) {
    voiceChannel.join().then(connnection => {
      
      tts(text, `gu`, 1).then((url) => {
      
        const dispatcher = connnection.play(url); 
        dispatcher.on('end', () => voiceChannel.leave());
    
      }).catch((err) => {
      
        message.channel.send(':no_entry_sign: Something wen\'t wrong.\n' + err);
        voiceChannel.leave();
        
      });
    });
  } else {
    return message.channel.send({ embed: {"title": "Error", "description": "TTS is already playing", "color": 0xff2222 } });
  }
}