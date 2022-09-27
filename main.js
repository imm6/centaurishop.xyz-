const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
const session = require("express-session");
const rbxf = require("./src/rbxf");
const bcrypt = require("bcrypt");
const request = require("request");
const paymentroutes = require("./src/routes/payment.routes");
const clodflareAPI = require("./src/controllers/cloudflare.controllers")
const discordcotroller = require("./src/controllers/discordwebhooks.controllers")
const coinflipcontroller = require("./src/controllers/coinflip.controllers")
const morgan = require("morgan");
const { default: axios } = require("axios");
const { Client, Intents } = require('discord.js');


app.use(morgan("dev"));
app.use(paymentroutes);
dotenv.config({ path: "./.env" });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("./views", express.static("views"));
app.use(express.static(__dirname + "/public"));

app.set("port", process.env.PORT || 80);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");

app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
rbxf.NobloxLog(process.env.COOKIET);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
async function comparepassword(password, hash) {
  var isSame = await bcrypt.compare(password, hash);
  return isSame;
}

app.get("/", function (req, res) {
  res.redirect("/index");
  
});

app.get("/index", (req, res) => {
  res.render("index", {
    stock: rbxf.GetRobux(),
  });
});

app.get("/TAC", function(req,res){
 res.render("tac")
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/dashboard", async (req, res) => {
  db.query(
    "SELECT * FROM users WHERE `username` = ? ",
    [req.session.user],
    async (error, results, rows) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        var stringu = JSON.stringify(results);
        var parsed = JSON.parse(stringu);
        (await req.session.centauri) == parsed[0].centauri;
        console.log(results);
        res.render("dashboard", {
          username: req.session.user,
          centauri: req.session.centauri,
          image: req.session.image,
          stock: rbxf.GetRobux(),
        });
      } else if (results.length == 0) {
        res.redirect("/login");
      }
    }
  );
});

app.post("/buy", async (req, res) => {
 console.log(req.body.amount)
 res.redirect("/dashboard")
});

app.post("/withdraw", async (req, res) => {
  var price = rbxf.GetPriceGamepass(req.body.id);
  var stock = rbxf.GetRobux();
  db.query(
    "SELECT * FROM users WHERE `username` = ? ",
    [req.session.user],
    async (error, results, rows) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        var stringu = JSON.stringify(results);
        var parsed = JSON.parse(stringu);
        var centauribalance = parsed[0].centauri;
        if (price > stock) {
          res.send("No hay suficiente Stock para comprar ese gamepass");
          res.redirect("/login");
        } else if (stock > price) {
          if (centauribalance >= price) {
            await rbxf.buyGamepass(req.body.id);
            var priceInt = parseInt(price);
            var centauribalanceInt = parseInt(centauribalance);
            const finalcentauris = centauribalanceInt - priceInt;
            var centauriwebhook = priceInt.toString();
            await discordcotroller.webhooksend(req.session.user,centauriwebhook)
            db.query(
              "UPDATE `users` SET `centauri` = ? WHERE `username` = ?",
              [finalcentauris, req.session.user],
              (error, results, rows) => {
                if (error) {
                  console.log(error);
                }
                res.redirect("/login");
              }
            );
          } else {
            res.send(
              "No tienes suficientes Centauris para retirar ese gamepass"
            );
          }
        }
      }
    }
  );
});

app.post("/auth/login", async function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE `Email` = ?",
    [email],
    async function (error, results, rows) {
      if (error) {
        console.log(error);
      }
      if (results.length == 0) {
        res.redirect("/login");
      } else if (results.length > 0) {
        var stringu = JSON.stringify(results);
        var parsed = JSON.parse(stringu);
        var boolean = await comparepassword(password, parsed[0].password);

        if (boolean === true) {
          req.session.user = parsed[0].username;
          req.session.centauri = parsed[0].centauri;
          req.session.image = parsed[0].image;
          res.redirect("/dashboard");
        } else {
          res.redirect("/login");
        }
      }
    }
  );
});

app.post("/auth/register", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var username = req.body.user;
  var centauri = 0;
  var image = `https://cdn.discordapp.com/attachments/917108181333835846/963421253341970502/nophoo.png`;
  if (email.includes("@") || email !== undefined) {
    if (username !== "") {
      if (password !== "") {
        var bpassword = await hashPassword(password);
        db.query(
          "SELECT * FROM users WHERE `Email` = ? ",
          [email],
          (error, results, rows) => {
            if (error) {
              console.log(error);
            }
            if (results.length == 0) {
              db.query(
                "INSERT INTO users (`email`,`password`,`username`,`centauri`,`image`) VALUES(?,?,?,?,?)",
                [email, bpassword, username, centauri, image],
                (error, results, rows) => {
                  if (error) {
                    console.log(error);
                  }
                  res.redirect("/login");
                }
              );
            } else if (results.length > 0) {
              res.send("Esa correo ya existe");
            }
          }
        );
      } else {
        res.redirect(`/login/`);
      }
    } else {
      res.redirect(`/login/`);
    }
  } else {
    res.redirect(`/login/`);
  }
});
const prefix = 'c!';
client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix))   return;
    const args = message.content.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length).toLowerCase(); 
     if (cmd === 'stock') {
       if (args[1]) return message.reply('Too many arguments.');
       if (args[2]) return message.reply('Too many arguments.');
       message.reply(`The current stock is **${rbxf.GetRobux()}** robux`)
      }
      if (cmd === 'setsecuritylevel') {
        if (message.member.roles.cache.find(r => r.name === "•│CloudflareSM")) {
          if (!args[1]) return message.reply('Insert the new level.');
          if (args[2]) return message.reply('Too many arguments.');
          var newLevel = await clodflareAPI.setSecLevel(args[1])}
          message.reply(`The new Cloudflare Security level is **${newLevel}**`)
        }   
        else{
        }

     if (cmd === 'getsecuritylevel') {
      if (message.member.roles.cache.find(r => r.name === "•│CloudflareSM")) {
        if (args[1]) return message.reply('Too many arguments.');
        if (args[2]) return message.reply('Too many arguments.');
        message.reply(`The Cloudflare Security actual level is **${await clodflareAPI.getSecLevel()}**`)
      }   
      else{
      } 
    }
    if (cmd === `balance`) {
      if (message.member.roles.cache.find(r => r.name === "•│Linked")) {
        if (args[1]) return message.reply('Too many arguments.');
        if (args[2]) return message.reply('Too many arguments.');
        db.query(
          "SELECT * FROM users WHERE `discord` = ? ",
          [message.member.user.tag],
          async (error, results, rows) => {
            if (error) {
              console.log(error);
            }
            if (results.length > 0) {
              var stringu = JSON.stringify(results);
              var parsed = JSON.parse(stringu);
              balance =  parsed[0].centauri;
              message.reply(`Hey **${message.member.displayName}** you have **${balance}** centauri's `)
            }
          }
          
        );
      }   
      else{
        message.reply(`You don't have Discord linked with Centauri`)
      } 
    }
    if (cmd === 'coinflip') {
      if (message.member.roles.cache.find(r => r.name === "•│Linked")) {
        if (!args[1]) return message.reply('Insert all arguments');
        if (!args[2]) return message.reply('Insert all arguments.');
        db.query(
          "SELECT * FROM users WHERE `discord` = ? ",
          [message.member.user.tag],
          async (error, results, rows) => {
            if (error) {
              console.log(error);
            }
            if (results.length > 0) {
              var stringu = JSON.stringify(results);
              var parsed = JSON.parse(stringu);
              balance =  parsed[0].centauri;
              var test = await coinflipcontroller.coinflip(args[1])
              var centauriapostados = args[2]
              var ganado = centauriapostados * 2
              if(balance < centauriapostados){
                message.reply(`No tienes suficentes centauri's para apostar esa cantidad`)
              }
              else{
                if (test == "win"){
                  var centauribalanceInt = parseInt(balance);
                  var centauriapostadosInt = parseInt(centauriapostados)
                  var finalwin = centauribalanceInt + centauriapostadosInt
                  db.query(
                    "UPDATE `users` SET `centauri` = ? WHERE `discord` = ?",
                    [finalwin, message.member.user.tag],
                    (error, results, rows) => {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                  message.reply(`Has ganado **${ganado}** centauri's`)
                }
                else if (test == "lose") {
                  var centauribalanceInt = parseInt(balance);
                  var centauriapostadosInt = parseInt(centauriapostados)
                  var final = centauribalanceInt - centauriapostadosInt                  
                  db.query(
                    "UPDATE `users` SET `centauri` = ? WHERE `discord` = ?",
                    [final, message.member.user.tag],
                    (error, results, rows) => {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                  message.reply(`Has perdido **${centauriapostados}** centauri's`)
                }
              }
              
            }
          }
        )
      }   
      else{
        message.reply(`You don't have Discord linked with Centauri`)
      } 
    }
    // New Discord Command

});
app.post("/genesisreport", async function (req, res, next) {
  var user = req.body.user;
  var reason = req.body.reason;
  
  await discordcotroller.genesishood(user,reason);
});

client.login(`OTU3MzQyNzg0MDAyNjA1MDc3.Yj9Y8g.jcxD6hBSe4cxdxHl6KLkhBuJE9E`);


app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
