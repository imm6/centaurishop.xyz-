var request = require("sync-request");
const noblox = require("noblox.js");
const dotenv = require("dotenv");
const parse = require("nodemon/lib/cli/parse");
const { jar } = require("request");
const request2 = require("request");

dotenv.config({ path: "./.env" });

function GetUser(id, name) {
  var name;
  var getUrl = `https://users.roblox.com/v1/users/${id}`;
  name = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.name;
  }
  return name;
}
function GetDescription(id) {
  var description;
  var getUrl = `https://users.roblox.com/v1/users/${id}`;
  description = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.description;
  }
  return description;
}
function GetNameGamepass(gid) {
  var gname;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gname = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Name;
  }
  return gname;
}
function GetDescriptionGamepass(gid) {
  var gdesc;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gdesc = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Description;
  }
  return gdesc;
}

function GetPriceGamepass(gid) {
  var gprice;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gprice = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.PriceInRobux;
  }
  return gprice;
}
function GetCreatorIdGamepass(gid) {
  var gcname;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gcname = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Creator.CreatorTargetId;
  }
  return gcname;
}

function GetImageIDGamepass(gid) {
  var gimage;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gimage = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.IconImageAssetId;
  }
  return gimage;
}

function GetProductIDGamepass(gid) {
  var gpid;
  var getUrl = `https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gid} `;
  gpid = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.ProductId;
  }
  return gpid;
}

function getNameAsset(aid) {
  var aname;
  var getUrl = `https://api.roblox.com/marketplace/productinfo?assetId=${aid}`;
  aname = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Name;
  }
  return aname;
}

function GetDescriptionAsset(aid) {
  var adesc;
  var getUrl = `https://api.roblox.com/marketplace/productinfo?assetId=${aid}`;
  adesc = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Description;
  }
  return adesc;
}
function GetPriceAsset(aid) {
  var aprice;
  const free = `Free`;
  var getUrl = `https://api.roblox.com/marketplace/productinfo?assetId=${aid}`;
  aprice = httpGet(getUrl);
  function httpGet(url) {
    const free = `Free`;
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    if (parsed.PriceInRobux == null) {
      return free;
    } else {
      return parsed.PriceInRobux;
    }
  }
  return aprice;
}

function GetCreatorIdAsset(aid) {
  var acname;
  var getUrl = `https://api.roblox.com/marketplace/productinfo?assetId=${aid}`;
  acname = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.Creator.CreatorTargetId;
  }
  return acname;
}

function GetImageIDAsset(aid) {
  var aimage;
  var getUrl = `https://api.roblox.com/marketplace/productinfo?assetId=${aid}`;
  aimage = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url);
    parsed = JSON.parse(response.body);
    return parsed.AssetId;
  }
  return aimage;
}

function GetRobux() {
  var grobux;
  var getUrl = `https://api.roblox.com/currency/balance`;
  grobux = httpGet(getUrl);
  function httpGet(url) {
    var response = request("GET", url, {
      headers: {
        cookie: `.ROBLOSECURITY=${process.env.COOKIET};`,
      },
    });
    parsed = JSON.parse(response.body);
    return parsed.robux;
  }
  return grobux;
}

async function buyGamepass(gid) {
  await NobloxLog();
  const jar = request2.jar();
  jar.setCookie = `.ROBLOSECURITY=${process.env.COOKIET}`;

  const options = { 
    method: "POST",
    url: `https://economy.roblox.com/v1/purchases/products/${GetProductIDGamepass(
      gid
    )}`,
    headers: {
      cookie: `.ROBLOSECURITY=${process.env.COOKIET}`,
      "x-csrf-token": await noblox.getGeneralToken(process.env.COOKIET),
      "Content-Type": " application/json",
    },
    body: { expectedCurrency: 1, expectedPrice: `${GetPriceGamepass(gid)}` },
    json: true,
    jar: `.ROBLOSECURITY=${process.env.COOKIET}`,
  };

  var buyed = request2(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body, body.reason);
  });
  return buyed;
}

async function NobloxLog() {
  const currentUser = await noblox.setCookie(process.env.COOKIET);
  console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`);
  console.log(await noblox.getGeneralToken(process.env.COOKIET));
}

module.exports = {
  GetUser,
  GetDescription,
  GetNameGamepass,
  GetDescriptionGamepass,
  GetPriceGamepass,
  GetCreatorIdGamepass,
  GetImageIDGamepass,
  NobloxLog,
  getNameAsset,
  GetDescriptionAsset,
  GetPriceAsset,
  GetCreatorIdAsset,
  GetImageIDAsset,
  GetRobux,
  GetProductIDGamepass,
  buyGamepass,
};
