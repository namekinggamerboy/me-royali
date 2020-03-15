var fs = require("fs"); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file
const Discord = require("discord.js");
var fs = require("fs"); //FileSystem
let config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

exports.run = (client, message, args, ops) => {
  //Collecting info about command

  var prefix = config[message.guild.id].prefix; //Prefix state
  var del = config[message.guild.id].delete; //Delete state
  var delTime = config[message.guild.id].deleteTime; //Time before delete state
  var volume = config[message.guild.id].volume; //Volume state
  var maxVolume = config[message.guild.id].maxVolume; //maxVolume state
  var levelup = config[message.guild.id].levelup; //levelups messages state
  var perm = true;

  if (!message.member.hasPermission("MANAGE_GUILD")) perm = false;

  if (message.author.id == ops.ownerId) perm = true;

  if (perm == true) {
    if (!args[0])
      return message.channel
        .send({
          //Send embed
          embed: {
            title: "Settings",
            description:
              "Here is all my settings \n*Use `" +
              prefix +
              "settings (name) (value)` to change the parameter*",
            color: 16098851,
            timestamp: "1337-01-01T02:28:00",
            footer: {
              text: message + ""
            },
            fields: [
              {
                name: "Prefix",
                value: prefix + ""
              },
              {
                name: "Auto-deleting",
                value:
                  del +
                  ", delay - ``" +
                  config[message.guild.id].deleteTime / 1000 +
                  "``" +
                  " seconds"
              },
              {
                name: "Default Volume",
                value: "`volume` - " + volume + "%"
              },
              {
                name: "Max Volume",
                value: "`maxVolume` - " + maxVolume + "%"
              },
              {
                name: "Level UP messages",
                value: "`levelup` - " + levelup
              },
                            {
              name: "esay to edit go and use dashboard",
              value: "https://me-royal-plus.glitch.me"
              },
            ]
          }
        })
        .then(msg => {
          if (config[message.guild.id].delete == "true") {
            msg.delete(config[message.guild.id].deleteTime);
          }
        }); //If no arguments, just 'settings'

    if (args[0] == "prefix") {
      //If first argument is 'prefix' or 'префикс' and second argument (new prefix) isn't null...
      if (!args[1])
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter prefix",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          }); //If no prefix value
      if (args[1].length >= 5)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter prefix that smaller than 5 symbols",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          }); //If prefix value longer than 5

      prefix = args[1]; //...Prefix will become new
      //Then change the configuration in memory
      config[message.guild.id].prefix = prefix;
      //and save the file.
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return console.log(err);
      });
      message.channel
        .send({
          //Embed with text of success
          embed: {
            color: 5308240,
            timestamp: "1337-01-01T02:28:00",
            footer: {
              text: message + ""
            },
            fields: [
              {
                name: "Prefix successfuly changed!",
                value: "Now prefix is `" + prefix + "`"
              }
            ]
          }
        })
        .then(msg => {
          if (config[message.guild.id].delete == "true") {
            msg.delete(config[message.guild.id].deleteTime);
          }
        });
    }

    if ((args[0] == "delete" && args[1] != null) || args[0] == "autodelete") {
      //If first argument is 'prefix' or 'префикс' and second argument (new prefix) isn't null...
      if (args[1] === "1" || args[1] === "yes" || args[1] === "true") {
        del = "true"; //...Auto-deleting will become 'Yes'
        config[message.guild.id].delete = del;
        //and save the file.
        fs.writeFile(
          "./config.json",
          JSON.stringify(config),
          err => console.error
        );
        message.channel
          .send({
            //Embed with text of success
            embed: {
              color: 5308240,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              fields: [
                {
                  name: "Parameter successfuly changed!",
                  value:
                    "Now commands will be deleted after " +
                    config[message.guild.id].deleteTime / 1000 +
                    " seconds"
                }
              ]
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });
      }
      if (args[1] === "0" || args[1] === "false" || args[1] === "no") {
        del = "false"; //...Auto-deleting will become 'No'
        config[message.guild.id].delete = del;
        //and save the file.
        fs.writeFile(
          "./config.json",
          JSON.stringify(config),
          err => console.error
        );
        message.channel
          .send({
            //Embed with text of success
            embed: {
              color: 5308240,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              fields: [
                {
                  name: "Parameter successfuly changed!",
                  value: "Now commands won't be deleted"
                }
              ]
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });
      }
    }

    if (
      args[0] == "time" ||
      args[0] == "deleteTime" ||
      args[0] == "deletetime"
    ) {
      if (!args[1])
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          }); //If no value
      if (isNaN(args[1]) || args[1] > 360 || args[1] < 1)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value between 1 and 360",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });

      delTime = args[1] * 1000;
      //Then change the configuration in memory
      config[message.guild.id].deleteTime = delTime;
      //and save the file.
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return console.log(err);
      });
      message.channel
        .send({
          //Embed with text of success
          embed: {
            color: 5308240,
            timestamp: "1337-01-01T02:28:00",
            footer: {
              text: message + ""
            },
            fields: [
              {
                name: "Parameter `delTime` successfuly changed!",
                value: "Now `delTime` is " + delTime / 1000 + " seconds"
              }
            ]
          }
        })
        .then(msg => {
          if (config[message.guild.id].delete == "true") {
            msg.delete(config[message.guild.id].deleteTime);
          }
        });
    }

    if (args[0] == "maxVolume" || args[0] == "maxvolume") {
      if (!args[1])
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          }); //If no value
      if (isNaN(args[1]) || args[1] > 200 || args[1] < 0)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value between 0 and 200",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });

      maxVolume = args[1];
      //Then change the configuration in memory
      config[message.guild.id].maxVolume = maxVolume;
      //and save the file.
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return console.log(err);
      });
      message.channel
        .send({
          //Embed with text of success
          embed: {
            color: 5308240,
            timestamp: "1337-01-01T02:28:00",
            footer: {
              text: message + ""
            },
            fields: [
              {
                name: "Parameter `maxVolume` successfuly changed!**",
                value: "Now `maxVolume` is " + maxVolume + "%"
              }
            ]
          }
        })
        .then(msg => {
          if (config[message.guild.id].delete == "true") {
            msg.delete(config[message.guild.id].deleteTime);
          }
        });
    }

    if (args[0] == "vol" || args[0] == "volume") {
      if (!args[1])
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          }); //If no value
      if (isNaN(args[1]) || args[1] > 200 || args[1] < 0)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter value between 0 and 200",
              title: "Error"
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });

      volume = args[1];
      //Then change the configuration in memory
      config[message.guild.id].volume = volume;
      //and save the file.
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return console.log(err);
      });
      message.channel
        .send({
          //Embed with text of success
          embed: {
            color: 5308240,
            timestamp: "1337-01-01T02:28:00",
            footer: {
              text: message + ""
            },
            fields: [
              {
                name: "Default volume successfuly changed!",
                value: "Now `volume` is " + volume + "%"
              }
            ]
          }
        })
        .then(msg => {
          if (config[message.guild.id].delete == "true") {
            msg.delete(config[message.guild.id].deleteTime);
          }
        });
    }

    if ((args[0] == "levelup" && args[1] != null) || args[0] == "lvlUp") {
      //If first argument is 'prefix' or 'префикс' and second argument (new prefix) isn't null...
      if (args[1] === "1" || args[1] === "yes" || args[1] === "true") {
        levelup = "true"; //...Auto-deleting will become 'Yes'
        config[message.guild.id].levelup = levelup;
        //and save the file.
        fs.writeFile(
          "./config.json",
          JSON.stringify(config),
          err => console.error
        );
        message.channel
          .send({
            //Embed with text of success
            embed: {
              color: 5308240,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              fields: [
                {
                  name: "Parameter successfuly changed!",
                  value: "Now levelUPs messages will be sent"
                }
              ]
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });
      }
      if (args[1] === "0" || args[1] === "false" || args[1] === "no") {
        levelup = "false"; //...Auto-deleting will become 'No'
        config[message.guild.id].levelup = levelup;
        //and save the file.
        fs.writeFile(
          "./config.json",
          JSON.stringify(config),
          err => console.error
        );
        message.channel
          .send({
            //Embed with text of success
            embed: {
              color: 5308240,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              fields: [
                {
                  name: "Parameter successfuly changed!",
                  value: "Now levelUPs messages won't be sent"
                }
              ]
            }
          })
          .then(msg => {
            if (config[message.guild.id].delete == "true") {
              msg.delete(config[message.guild.id].deleteTime);
            }
          });
      }
    }
  } else {
    message.channel
      .send({
        embed: {
          description: "Denied!",
          color: 0xff2222,
          title: "Error"
        }
      })
      .then(msg => {
        if (config[message.guild.id].delete == "true") {
          msg.delete(config[message.guild.id].deleteTime);
        }
      });
  }
};
