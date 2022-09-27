const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql");
const app = express();


const { default: axios } = require("axios");
dotenv.config({ path: "./.env" });

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function getSecLevel(req, res) {
    
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CCENTAURI}/settings/security_level`,
        {
          headers:{
            'X-Auth-Email': `${process.env.CLOUDEMAIL}`,
            'X-Auth-Key': `${process.env.CLOUDAUTH}`,
            'Content-Type': 'application/json'
          }
        }
      );
      var level = response.data.result.value
      return level;
}

async function setSecLevel(newlevel) {
    
  const response = await axios.patch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CCENTAURI}/settings/security_level`,{'value': `${newlevel}`},
    {
        headers:{
          'X-Auth-Email': `${process.env.CLOUDEMAIL}`,
          'X-Auth-Key': `${process.env.CLOUDAUTH}`,
          'Content-Type': 'application/json'
        }
    }
  );
  var newseclevel = response.data.result.value
  return newseclevel;
}

module.exports = { getSecLevel, setSecLevel};
