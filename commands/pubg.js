var fs = require('fs');//FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require("discord.js");

var pubg = ["https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBKbUZP5vt2cUQ0G9qOUA5dDRiv6xWJLFJIXbc5jNygLuBsPWA", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOFa0FO77VdDfFYHYe4_NhQFGmoIQjLfSnZ4UVTAkrpxd1-tPQ", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOFa0FO77VdDfFYHYe4_NhQFGmoIQjLfSnZ4UVTAkrpxd1-tPQ;https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOFa0FO77VdDfFYHYe4_NhQFGmoIQjLfSnZ4UVTAkrpxd1-tPQ", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOFa0FO77VdDfFYHYe4_NhQFGmoIQjLfSnZ4UVTAkrpxd1-tPQ", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTvi5i5OLUPlyLNsUhnI6_Dl_c2KSqzes7rI5ZVVTXDwxCulDu_", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRqRVHfalmNAeeciZuysXs726G6cakBd7xhtjwQPiH9-t9cO_y8", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSGwsMlUX5NzlMoHdJrYnUyBnrZZhm2WR56uOY5_zwCzOErGtgz", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSbB3YOqwkSLC7UYAlcRjJzIcfV-SXBpD8izjlpzqtpdJ4rWNLa", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS80LHaU0DkPoQfA_UqwH8QhyVdJEq-PVcOIrpU7ir7PoqMf6q2", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBKbUZP5vt2cUQ0G9qOUA5dDRiv6xWJLFJIXbc5jNygLuBsPWA"]; 
var pub = Math.floor(Math.random() * pubg.length);

exports.run = (client, message, args) => {
  
  message.channel.send(
    { embed:{
      color: 0x00FFFF,
      title: `PUBG CRATE OPENING...`,
     "image": {
            "url": "https://cdn.discordapp.com/attachments/626236449259520005/634957883330527261/miniGif_20191019090454.gif"
        }
    }}
    )
  .then((msg) => { setTimeout(function() { msg.edit(
    {
      embed:{
        title: `YOUR GIFT TO ${message.author.username}`,
        color: 0x00FFFF,
        "image":{
        "url": ""+ pubg[pub] +""
      }
      }}
  ); }, 6000)});
}
