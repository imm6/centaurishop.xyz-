const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql");
const app = express();


const { default: axios } = require("axios");
const { query } = require("express");
const { message } = require("noblox.js");
dotenv.config({ path: "./.env" });

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

function randomInRange(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}


async function coinflip(apuesta){
     var resultfinal = randomInRange(1,2)
     var win = "win"
     var lose = "lose"
     if (apuesta == "tails"){
      var apuestaint = 1
      console.log(apuestaint,resultfinal)
     }
      else if(apuesta = "head"){
        var apuestaint = 2
        console.log(apuestaint,resultfinal)
     }
     if(apuestaint == resultfinal) {
      return win;
     }
     else {

      return lose;
     }
      
}

module.exports = { coinflip};