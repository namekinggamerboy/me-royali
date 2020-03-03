const Discord = require('discord.js');
const translate = require('@k3rn31p4nic/google-translate-api');

module.exports.run = async (bot, message, args) => {
  
  let langs = ['afrikaans','albanian','amharic','arabic','armenian','azerbaijani','bangla','basque','belarusian','bengali','bosnian','bulgarian','burmese','catalan','cebuano','chichewa','chinese simplified','chinese traditional','corsican','croatian','czech','danish','dutch','english','esperanto','estonian','filipino','finnish','french','frisian','galician','georgian','german','greek','gujarati','haitian creole','hausa','hawaiian','hebrew','hindi','hmong','hungarian','icelandic','igbo','indonesian','irish','italian','japanese','javanese','kannada','kazakh','khmer','korean','kurdish (kurmanji)','kyrgyz','lao','latin','latvian','lithuanian','luxembourgish','macedonian','malagasy','malay','malayalam','maltese','maori','marathi','mongolian','myanmar (burmese)','nepali','norwegian','nyanja','pashto','persian','polish','portugese','punjabi','romanian','russian','samoan','scottish gaelic','serbian','sesotho','shona','sindhi','sinhala','slovak','slovenian','somali','spanish','sundanese','swahili','swedish','tajik','tamil','telugu','thai','turkish','ukrainian','urdu','uzbek','vietnamese','welsh','xhosa','yiddish','yoruba','zulu'];

        let argie = args.join(` `).split(" | ")
        let langie = argie[0]
        let text = argie[1]

        if(langie === undefined){

            let emb = new Discord.RichEmbed()
            .setColor("#00ff00")
            .setTitle("Please choose language to translate to:")
            .addField("Usage", `?translate <language> | <text>`)

            message.channel.send(emb)

        } else if(text === undefined) {

            let emb = new Discord.RichEmbed()
            .setColor("#00ff00")
            .setTitle("What do you want to translate?")
            .addField("Usage", `?translate <language> | <text>`)

            message.channel.send(emb)

        } else {

            let totransLC = langie.toLowerCase()

            let translation;

            if(!langs.includes(totransLC)){

                let emb = new Discord.RichEmbed()
                .setColor("#00ff00")
                .setTitle("Language not found!")
                .addField("Usage", `?translate <language> | <text>`)

            }

            translate(text, { to: totransLC }).then(trans =>{

                let emb = new Discord.RichEmbed()
                .setColor("#00ff00")
                .setDescription(trans.text)

                message.channel.send(emb)

            }) }
  }

module.exports.help = {
  
  name: 'translate'
}
