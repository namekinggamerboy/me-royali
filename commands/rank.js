const Discord = require("discord.js");
var fs = require('fs'); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const jimp = require('jimp');
const q = require('quick.db');
//const { canvasConstr } = require('canvas-constructor');
const image2base64 = require('image-to-base64');
const Canvas = require('canvas');
try {
  const cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));//Cards file
} catch (ex) {
  console.log("[ERROR] Cards overwrited");
  const cards = {}
  fs.writeFile("./cards.json", JSON.stringify(cards), (err) => console.error);
}
var cards = JSON.parse(fs.readFileSync("./cards.json", "utf8")); //Cards file

exports.run = (client, message, args, ops) => { //Collecting info about command
    if (message.guild.id !== "264445053596991498" && config[message.guild.id].levelup === 'false') return message.channel.send('this levelup is disabled');
  let member = message.mentions.members.first();
  if (!member) member = message.member;
  
  if (member.user.bot) return message.channel.send({ embed: {
    "description": "I can't show bot's rank card because it's bot after all!",
    "color": 0xff2222
  } });

  var l;
  var p;

  function map(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  var levels = new q.table("LEVELS")
  levels.fetch(`${message.guild.id}_${member.id}`).then(i => {
    l = i;
  });

  var widthXP;
  var points2 = new q.table("POINTS");
  points2.fetch(`${message.guild.id}_${member.id}`).then(i => {
    widthXP = map(i, 0, l * 300, 0, 615);
    p = i;
  });

  var pos = 0;
  var points = new q.table("TOTAL_POINTS");
  points.startsWith(`${message.guild.id}_`, {
    sort: '.data'
  }).then(resp => {
    var i = 0;
    for (i in resp) {
        if (client.users.get(resp[i].ID.split('_')[1]).id == member.user.id) {
        pos = parseInt(i, 10) + 1;
      }
    }
  });

  if (cards[member.id] === undefined) {
    cards[member.id] = {
      color: "#00FFFF",
      image: ""
    };
    fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), (err) => {
      if (err) return console.log(err)
    });
  }

  var color = cards[member.id].color;
  var colorRank = color;

  if (cards[member.id].color == undefined) {
    color = "#ffffff";
  }


  var colorStatus = "#00ff00";

  if (args.includes("-color")) {
    if (!args[args.indexOf("-color") + 1].startsWith("#")) {
      color = "#" + args[1];
      cards
    } else {
      color = args[1];
      colorRank = color;
    }

    if (color.length == 7) {
      cards[message.author.id].color = color;
      fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), (err) => {
        if (err) return console.log(err)
      });
      message.channel.send({
        embed: {
          "title": "Success",
          "description": "Color for your rank card successfuly changed! \nNow color - \`" + color + "\`",
          "color": 0x22ff22
        }
      });
    } else {
      return message.channel.send({
        embed: {
          "title": "Error",
          "description": "Invalid color",
          "color": 0xff2222
        }
      });
    }
  }

  if (args.includes("-image")) {
    if (args[args.indexOf("-image") + 1] == "" || args[args.indexOf("-image") + 1] == null) {
      message.channel.send({
        embed: {
          "title": "Success",
          "description": "Image for your rank card successfuly removed!",
          "color": 0x22ff22
        }
      });
      cards[message.author.id].image = "";
      fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), (err) => {
        if (err) return console.log(err)
      });
    } else {
    cards[message.author.id].image = args[args.indexOf("-image") + 1];
    fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), (err) => {
      if (err) return console.log(err)
    });
    message.channel.send({
      embed: {
        "title": "Success",
        "description": "Image for your rank card successfuly changed!\n*Use \`934x282\` images for best results*",
        "color": 0x22ff22
      }
    });}
  }

  if (member.presence.status === 'idle') colorStatus = "#ffff00";
  if (member.presence.status === 'offline') colorStatus = "#747f8d";
  if (member.presence.status === 'dnd') colorStatus = "#ff0000";

  let Image = Canvas.Image,
    canvas = new Canvas(934, 282),
    ctx = canvas.getContext('2d');

  var opacity = 1;
  
  let urlBG = cards[member.id].image;
  let url = member.user.displayAvatarURL({ format: 'png' });
  jimp.read(url, (err, ava) => {
    if (err) return console.log(err);
    ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
      if (err) return console.log(err);
      cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));
      
      if (cards[member.id].image == "" || cards[member.id].image == null) {
        urlBG = "https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png";
      }
      
      jimp.read(urlBG, (err, imageBG) => {
        if (err) return console.log(err);
        imageBG.getBuffer(jimp.MIME_PNG, (err, bufBG) => {
          if (err) return console.log(err);

          let Avatar = Canvas.Image;
          let ava = new Avatar;
          ava.src = buf;

          let Background = Canvas.Image;
          let bg = new Background;
          bg.src = bufBG;

          var centerX = canvas.width / 2;
          var centerY = canvas.height / 2;

          ctx.fillStyle = colorRank;
          ctx.fillRect(0, 0, 61, 282);

          if (cards[message.author.id].image == "" || cards[message.author.id].image == null) {
            opacity = 1;
          } else {
            ctx.drawImage(bg, 0, 0, 934, 282); 
            opacity = 0.75;
          }


          ctx.font = "24px Arial";
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "start";
          ctx.fillText(`${member.user.username}`, 264, 164);
          ctx.font = "italic 24px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.textAlign = "center";
          ctx.fillText(`#${member.user.discriminator}`, ctx.measureText(`${member.user.username}`).width + 10 + 316, 164);
          /*LEVEL*/
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = colorRank;
          ctx.textAlign = "end";
          ctx.fillText(l, 934 - 64, 82);
          ctx.fillText("LEVEL", 934 - 64 - ctx.measureText(l).width - 16, 82);
          /*RANK*/
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "end";
          ctx.fillText(pos, 934 - 64 - ctx.measureText(l).width - 16 - ctx.measureText(`LEVEL`).width - 16, 82);
          ctx.fillText("RANK", 934 - 64 - ctx.measureText(l).width - 16 - ctx.measureText(`LEVEL`).width - 16 - ctx.measureText(pos).width - 16, 82);
          /*XPS*/
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.textAlign = "start";
          ctx.fillText("/ " + l * 300, 624 + ctx.measureText(p).width + 10, 164);
          ctx.fillStyle = colorRank;
          ctx.fillText(p, 624, 164);

          if (widthXP > 615 - 18.5) widthXP = 615 - 18.5;

          ctx.beginPath();
          ctx.fillStyle = "#424751";
          ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
          ctx.fill();
          ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
          ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
          ctx.fill();
          ctx.fillRect(257 + 18.5, 147.5 + 36.25, widthXP, 37.5);
          ctx.arc(257 + 18.5 + widthXP, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
          ctx.fill();

          ctx.beginPath();
          ctx.lineWidth = 12;
          ctx.arc(85 + 75, 66 + 75, 75, 0, 2 * Math.PI, false);
          ctx.strokeStyle = colorStatus;
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(ava, 85, 66, 150, 150);
let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "rank.png");
          message.channel.send(attachment);
        });
      });
    });
  });
};

