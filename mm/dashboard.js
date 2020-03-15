// Native Node Imports
const url = require("url");
const path = require("path");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
// Used for Permission Resolving...
const Discord = require("discord.js");

// Express Session
const express = require("express");
const app = express();

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;

// Helmet is a security plugin
//const helmet = require('helmet');

// Used to parse Markdown from things like ExtendedHelp
const md = require("marked");

// For logging
const morgan = require("morgan");

// For stats
const moment = require("moment");
require("moment-duration-format");

module.exports = client => {
  if ("true" !== "true") return client.log("log", "Dashboard disabled", "INFO");
  // It's easier to deal with complex paths.
  // This resolves to: yourbotdir/dashboard/
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

  // This resolves to: yourbotdir/dashboard/templates/
  // which is the folder that stores all the internal template files.
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

  app.set("trust proxy", 5); // Proxy support
  // The public data directory, which is accessible from the *browser*.
  // It contains all css, client javascript, and images needed for the site.
  app.use(
    "/public",
    express.static(path.resolve(`${dataDir}${path.sep}public`), {
      maxAge: "10d"
    })
  );
  app.use(morgan("combined")); // Logger

  // uhhhh check what these do.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  /*
	This defines the **Passport** oauth2 data. A few things are necessary here.

	clientID = Your bot's client ID, at the top of your app page. Please note,
		older bots have BOTH a client ID and a Bot ID. Use the Client one.
	clientSecret: The secret code at the top of the app page that you have to
		click to reveal. Yes that one we told you you'd never use.
	callbackURL: The URL that will be called after the login. This URL must be
		available from your PC for now, but must be available publically if you're
		ever to use this dashboard in an actual bot.
	scope: The data scopes we need for data. identify and guilds are sufficient
		for most purposes. You might have to add more if you want access to more
		stuff from the user. See: https://discordapp.com/developers/docs/topics/oauth2

	See config.js.example to set these up.
	*/

  var protocol;

  if ("true" === "true") {
    client.protocol = "https://";
  } else {
    client.protocol = "http://";
  }

  protocol = client.protocol;

  client.callbackURL = `${protocol}me-royal-plus.glitch.me/callback`;
  console.log(`Callback URL: ${client.callbackURL}`);
  passport.use(
    new Strategy(
      {
        clientID: "674108575118786560",
        clientSecret: "0yMpa5WCzQxHGNDIKwcDtg9q4wmlZb3N",
        callbackURL: client.callbackURL,
        scope: ["identify", "guilds"]
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );

  // Session data, used for temporary storage of your visitor's session information.
  // the `secret` is in fact a 'salt' for the data, and should not be shared publicly.
  app.use(
    session({
      secret: "0yMpa5WCzQxHGNDIKwcDtg9q4wmlZb3N",
      resave: false,
      saveUninitialized: false
    })
  );

  // Initializes passport and session.
  app.use(passport.initialize());
  app.use(passport.session());

  // The domain name used in various endpoints to link between pages.
  app.locals.domain = "me-royal-plus.glitch.me";

  // The EJS templating engine gives us more power
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  // body-parser reads incoming JSON or FORM data and simplifies their
  // use in code.
  var bodyParser = require("body-parser");
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true
    })
  );

  /*
	Authentication Checks. checkAuth verifies regular authentication,
	whereas checkAdmin verifies the bot owner. Those are used in url
	endpoints to give specific permissions.
	*/
  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  function cAuth(req, res) {
    if (req.isAuthenticated()) return;
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.id === "596521432507219980")
      return next();
    req.session.backURL = req.originalURL;
    res.redirect("/");
  }

  var privacyMD = "";
  fs.readFile(
    `${process.cwd()}${path.sep}dashboard${path.sep}public${
      path.sep
    }PRIVACY.md`,
    function(err, data) {
      if (err) {
        console.log(err);
        privacyMD = "Error";
        return;
      }
      privacyMD = data
        .toString()
        .replace(/\{\{botName\}\}/g, client.user.username)
        .replace(/\{\{email\}\}/g, "nameboy");
      if ("true" !== "true") {
        privacyMD = privacyMD.replace(
          "Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures.",
          ""
        );
      }
    }
  );

  var termsMD = "";
  fs.readFile(
    `${process.cwd()}${path.sep}dashboard${path.sep}public${path.sep}TERMS.md`,
    function(err, data) {
      if (err) {
        console.log(err);
        privacyMD = "Error";
        return;
      }
      termsMD = data
        .toString()
        .replace(/\{\{botName\}\}/g, client.user.username)
        .replace(/\{\{email\}\}/g, "nameboy");
    }
  );

  // Index page. If the user is authenticated, it shows their info
  // at the top right of the screen.
  app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}index.ejs`), {
        bot: client,
        auth: true,
        user: req.user
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}index.ejs`), {
        bot: client,
        auth: false,
        user: null
      });
    }
  });

  app.get("/stats", (req, res) => {
    if ("false" === "true") {
      cAuth(req, res);
    }
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");
    //const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
    const members = `${client.users.filter(u => u.id !== "1").size} (${
      client.users.filter(u => u.id !== "1").filter(u => u.bot).size
    } bots)`;
    const textChannels = client.channels.filter(c => c.type === "text").size;
    const voiceChannels = client.channels.filter(c => c.type === "voice").size;
    const guilds = client.guilds.size;
    res.render(path.resolve(`${templateDir}${path.sep}stats.ejs`), {
      bot: client,
      auth: req.isAuthenticated() ? true : false,
      user: req.isAuthenticated() ? req.user : null,
      stats: {
        servers: guilds,
        members: members,
        text: textChannels,
        voice: voiceChannels,
        uptime: duration,
        commands: client.commandsNumber,
        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        dVersion: Discord.version,
        nVersion: process.version,
        bVersion: client.version
      }
    });
  });

  app.get("/legal", function(req, res) {
    md.setOptions({
      renderer: new md.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    /*var showdown	= require('showdown');
		var	converter = new showdown.Converter(),
			textPr			= privacyMD,
			htmlPr			= converter.makeHtml(textPr),
			textTe			= termsMD,
			htmlTe			= converter.makeHtml(textTe);
		res.render(path.resolve(`${templateDir}${path.sep}legal.ejs`), {
			bot: client,
			auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
			privacy: htmlPr.replace(/\\'/g, `'`),
			terms: htmlTe.replace(/\\'/g, `'`),
			edited: client.config.dashboard.legalTemplates.lastEdited
		});*/

    res.render(path.resolve(`${templateDir}${path.sep}legal.ejs`), {
      bot: client,
      auth: req.isAuthenticated() ? true : false,
      user: req.isAuthenticated() ? req.user : null,
      privacy: md(privacyMD),
      terms: md(termsMD),
      edited: client.config.dashboard.legalTemplates.lastEdited
    });
  });

  // The login page saves the page the person was on in the session,
  // then throws the user to the Discord OAuth2 login page.
  app.get(
    "/login",
    (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    },
    passport.authenticate("discord")
  );

  app.get(
    "/callback",
    passport.authenticate("discord", {
      failureRedirect: "/"
    }),
    (req, res) => {
      if (req.session.backURL) {
        res.redirect(req.session.backURL);
        req.session.backURL = null;
      } else {
        res.redirect("/");
      }
    }
  );

  app.get("/admin", checkAdmin, (req, res) => {
    res.render(path.resolve(`${templateDir}${path.sep}admin.ejs`), {
      bot: client,
      user: req.user,
      auth: true
    });
  });

  app.get("/dashboard", checkAuth, (req, res) => {
    const perms = Discord.EvaluatedPermissions;
    res.render(path.resolve(`${templateDir}${path.sep}dashboard.ejs`), {
      perms: perms,
      bot: client,
      user: req.user,
      auth: true
    });
  });

  app.get("/add/:guildID", checkAuth, (req, res) => {
    req.session.backURL = "/dashboard";
    var invitePerm = client.config.dashboard.invitePerm;
    var inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${
      client.appInfo.id
    }&scope=bot&guild_id=${
      req.params.guildID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      `${client.callbackURL}`
    )}&permissions=${invitePerm}`;
    if (client.guilds.has(req.params.guildID)) {
      res.send(
        '<p>The bot is already there... <script>setTimeout(function () { window.location="/dashboard"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/dashboard" /></noscript>'
      );
    } else {
      res.redirect(inviteURL);
    }
  });

  app.post("/manage/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && !!guild.member(req.user.id)
        ? guild.member(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === "596521432507219980") {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/");
    }
        let data = req.body;
    let sendprefix = data.send_prefix;

      config[guild.id].prefix = sendprefix;
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return;
        console.log(err);
});
    
    let sendp1 = data.send_levelup;

      config[guild.id].levelup = sendp1;
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
        if (err) return;
        console.log(err);
      });
 let senddelete = req.body.send_delete;

config[guild.id].delete = senddelete;
fs.writeFile("./config.json", JSON.stringify(config, null, 2), err => {
if (err) return
console.log(err);
});
    res.redirect(`/manage/${req.params.guildID}`);
  });

  app.get("/manage/:guildID", checkAuth, (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && !!guild.member(req.user.id)
        ? guild.member(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === "596521432507219980") {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/dashboard");
    }
    res.render(path.resolve(`${templateDir}${path.sep}manage.ejs`), {
      bot: client,
      guild: guild,
      config: config[req.params.guildID],
      user: req.user,
      auth: true
    });
  });
  
    app.post("/rank/:userID", checkAuth, async (req, res) => {
    
  let cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));     
      let user = req.user;
        let data = req.body;
    let sendimage = data.send_image;

      cards[user.id].image = sendimage;
      fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), err => {
        if (err) return;
        console.log(err);
});
    
    let sendp1 = data.send_color;

      cards[user.id].color = sendp1;
      fs.writeFile("./cards.json", JSON.stringify(cards, null, 2), err => {
        if (err) return;
        console.log(err);
      });
  res.redirect(`/rank/${req.user.id}`);
  });

  app.get("/rank/:userID", checkAuth, (req, res) => {

  let user = req.user;
     let cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));  
    res.render(path.resolve(`${templateDir}${path.sep}rank.ejs`), {
      bot: client,
      ran: cards[user.id],
      user: req.user,
      auth: true
    });
  });

  app.get("/leave/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && !!guild.member(req.user.id)
        ? guild.member(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === "596521432507219980") {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/dashboard");
    }
    await guild.leave();
    if (req.user.id === "596521432507219980") {
      return res.redirect("/admin");
    }
    res.redirect("/dashboard");
  });

  app.get("/reset/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged =
      guild && !!guild.member(req.user.id)
        ? guild.member(req.user.id).permissions.has("MANAGE_GUILD")
        : false;
    if (req.user.id === client.config.ownerID) {
      console.log(`Admin bypass for managing server: ${req.params.guildID}`);
    } else if (!isManaged) {
      res.redirect("/dashboard");
    }
    client.settings.set(guild.id, client.config.defaultSettings);
    res.redirect(`/manage/${req.params.guildID}`);
  });
app.get("/game", (req, res) => {
 res.render(path.resolve(`${templateDir}${path.sep}game.ejs`));
});
  app.get("/commands", (req, res) => {
    if (req.isAuthenticated()) {
      res.render(path.resolve(`${templateDir}${path.sep}commands.ejs`), {
        bot: client,
        auth: true,
        user: req.user,
        md: md
      });
    } else {
      res.render(path.resolve(`${templateDir}${path.sep}commands.ejs`), {
        bot: client,
        auth: false,
        user: null,
        md: md
      });
    }
  });
 
app.get("/rankp", async (res, req) => {
var cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));
var Canvas = require('canvas');
let Image = Canvas.Image,
    canvas = new Canvas(934, 282),
    ctx = canvas.getContext('2d');
  function map(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
let bg = cards.image;
let user = client.users.get('596521432507219980');
let colorRank = cards.color;
let color = colorRank;
let l = "14";
let p = "4";
let ran = cards;
var opacity = 1;
let widthXP = "30";
let pos = p;
          if (ran.image == "" || ran.image == null) {
            opacity = 1;
          } else {
            ctx.drawImage(bg, 0, 0, 934, 282); 
            opacity = 0.75;
          }


          ctx.font = "24px Arial";
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "start";
          ctx.fillText(`${user.username}`, 264, 164);
          ctx.font = "italic 24px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.textAlign = "center";
          ctx.fillText(`#${user.discriminator}`, ctx.measureText(`${user.username}`).width + 10 + 316, 164);
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
          ctx.strokeStyle = "#0099ff";
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(user.displayAvatarURL({ format: 'png', size: 512}), 85, 66, 150, 150);
res.writeHead(200, { "Content-Type": "image/png" });
  res.end(await Image.toBuffer(), "binary");
});  

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("*", function(req, res) {
    // Catch-all 404
    res.send(
      '<p>404 File Not Found. Please wait...<p> <script>setTimeout(function () { window.location = "/"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/" /></noscript>'
    );
  });

  client.site = app
    .listen("3000", function() {
      console.log(`Dashboard running on port 3000`);
    })
    .on("error", err => {
      client.log("ERROR", `Error with starting dashboard: ${err.code}`);
      return process.exit(0);
    });
};
