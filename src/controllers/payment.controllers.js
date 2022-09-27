const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const discordcotroller = require("./discordwebhooks.controllers")

const app = express();
app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);

const { default: axios } = require("axios");
dotenv.config({ path: "./.env" });

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function createorder(centauripoints, price, user) {
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: `${price}`,
        },
        description: `${centauripoints} Centauri Points`,
      },
    ],
    application_context: {
      brand_name: "Centauri - Cheap Robux Shop",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: `http://localhost/capture-order/${centauripoints}/${user}`,
      cancel_url: "http://localhost/cancel-order",
    },
  };
  const response = await axios.post(
    `${process.env.PPAPI}/v2/checkout/orders`,
    order,
    {
      auth: {
        username: process.env.PPCLIENT,
        password: process.env.PPSEC,
      },
    }
  );
  return response.data.links[1].href;
}

const captureorder = async (req, res) => {
  const { token, PayerID } = req.query;
  console.log(token, PayerID);
  const resposne = await axios.post(
    `${process.env.PPAPI}/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username: process.env.PPCLIENT,
        password: process.env.PPSEC,
      },
    }
  );
  console.log(resposne.data.status);
  console.log(req.params);
  var centauripoints = req.params.centauripoints;
  var centauripointsInt = parseInt(centauripoints);
  var status = resposne.data.status;
  var user = req.params.user;
  if (status == "COMPLETED") {
    db.query(
      "SELECT * FROM users WHERE `username` = ?",
      [user],
      async function (error, results, rows) {
        if (error) {
          console.log(error);
        }
        if (results.length == 0) {
        } else if (results.length > 0) {
          var stringu = JSON.stringify(results);
          var parsed = JSON.parse(stringu);
          var currentcentauri = parsed[0].centauri;
          var currentcentauriInt = parseInt(currentcentauri);
          const addpoints = currentcentauriInt + centauripointsInt;
          var price = centauripointsInt / 1000 * 3.40;
          console.log(addpoints);
          db.query(
            "UPDATE `users` SET `centauri` = ? WHERE `username` = ?",
            [addpoints, user],
            (error, results, rows) => {
              if (error) {
                console.log(error);
              }
              discordcotroller.WPagoRealziado(user,centauripointsInt,price)
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
};

const cancelorder = (req, res) => {
  res.redirect(`/dashboard`);
};

module.exports = { createorder, captureorder, cancelorder };
