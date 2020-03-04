const discord = require('discord.js');
const webshot = require('webshot');
exports.run = async (client, message, args) => {
  var options = {
    screenSize: { 
      width: 960, height: 1024
    },
   shotSize: { 
     width: 960, height: 'all'
   }
,
 onLoadFinished: {
    fn: function(status) {
      var tags = document.getElementsByTagName(this.tagToReplace);

      for (var i=0; i<tags.length; i++) {
        var tag = tags[i];
        tag.innerHTML = 'The loading status of this page is: ' + status;
      }
    }
  , context: {tagToReplace: 'h1'}
  }
};
const file = new discord.MessageEmbed()
.setTitle('http://'+args)
.setColor("RANDOM")
.attachFiles(['./google.png'])
.setImage('attachment://google.png');
  webshot(args.join(" "), "google.png", options, err => {
    if (err)                        message.channel.send('There was an error, <@!'+message.author.id+'>. Please try `'+message.content+'` again later.', err);
                      else
 message.channel.send(file);
                  });
  
}