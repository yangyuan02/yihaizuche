const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const consola = require("consola");

const citys = JSON.parse(fs.readFileSync("city.txt", "utf-8"));
const baseUrl = city =>
  `https://mzhuanche.1hai.cn/Address/PickAirport?CityName=${encodeURI(
    city
  )}&AddrType=PickAir&InitialUrl=~%2f..%2f..%2fOrder%2fStep1%3fTripType%3dJJ`;

const options = {
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Cookie:
      'ASP.NET_SessionId=k3tbkajhrafeqjbo5lgns5to; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221684f37796262a-0771c54349d48f-2d604637-250125-1684f377963516%22%2C%22%24device_id%22%3A%221684f37796262a-0771c54349d48f-2d604637-250125-1684f377963516%22%2C%22props%22%3A%7B%7D%7D; ai_user=Ta2kp|2019-01-15T01:55:50.113Z; Hm_lvt_3d7f6839f5a39e141432b11842e73e26=1547533687; Hm_lpvt_3d7f6839f5a39e141432b11842e73e26=1547533687; __xsptplusUT_604=1; __xsptplus604=604.4.1547605754.1547605754.1%232%7Cwww.baidu.com%7C%7C%7C%7C%23%23GQIHVG-C4_0zuVuB2XTiecx_pDYT_QlD%23; zjfr_showEntrance=showEntrance; zjfr_latitude=28; zjfr_logitude=131; zjfr_Token=1756559003; zjfr_l=2%2B2soujuUW/54NAOL/Ne9VN9YWZkd5YZOkElRbLhaNQMckoxBIjNukbzChnPUagFOje2F55R4kcwyRgNcQV9Bl5tadPGQdHfAP%2BfNsOlrNVLNExhsc0VoeN2lmA/P1Urwv/q6gddSlbsubDFHBv/M74ZV7pWGNFUZ4FMokeJB9Nqkn5za1VqrXaAIinb0ghqfHElxILufL1iNUaSEz7DtxVbRciMX4H2UIGaDqLlyyTyjOJQsdPInuoyUWgJpkqUNv5VI2IwW/wRdpYOjU0vEbxmvnZjwiF3zbLUGX9YSM6yMY%2BsGAdjEhlbIkpF6zyFVm2Oh6hKgi9nLI0tE3tZgYlm2y4TY/tu%2Bi%2Bax4/odA2GJXdjabRliYM8BecNKzurWPVRQ9yde4EpNuDg5K6nxC3EB4v2gqEWGqf5UnDtZ3IOD29iwwP4FIrcloJE3B/G6dCPtj4k0fg0EVCyp8Qh8xEt1EwTbSL%2BFIylgwKxJ6wz/SV%2BUweaKKl9yZvWlj87t4r5dHoGqeW418FwFBRYzA==; zjfr_CustomerInfo=%2BRMimuApY8vSXXzljHlQJhaqfPmZJApT1P0AL9HNrtbIb2ZECo%2BrzQ%2BDx/IFkFMD%2BsKR/W6Z7P/eFOdJ/7ogNg8UH/C0nhrMwj04F/G3zUzRojj02JWotxRSlACCk5Rzi0lmiQF/aotP2t2gT5YIq9wf3P6Pi4itPmvC4ZqpujthAqI8y3WPbv0ugxEPFRb52iZ7VlIlyuGzq/Q/N2tsIYQZfpLTSIQHyxuAwjPuONGE48pxoYHe4En%2Bpb0HK1RnbE8vzC%2B773HKcqVBp61AE/3msIL8iGZxgJo6Ac7sTV28A43z%2BBsWTfS%2B6W03kXtumWWzZCgkZ3Il7kNHBsFSTi1mCzFTsBG4XCjKjAEbk74M7FzVpzi4Xr7xobyQh%2BKxFs8E5vlDWRN2xEsreVA8m2bAH0APsYbn7G54GvdexcjP8ly90VmwPuX3WW6LWCR47LXrqFTunosOW6okk%2BdB4L6%2BTy9gQKpxnRG9V30ZtnRFBgDhEPAxs2ksITOZA5oMgJB89ocB2HuYx4RmGxreR6WbEu/1wgOR2wamAE%2BhSyjL/ZV%2B8MXSe6Xqxu8%2BH1yV6z5aSwzAw4NcglQc7xuJtD/tULyNee/zuk4cGg7xO3IECFUtzMcrBg==; zjfr_md=UlCdyOpHdbex$MAEo2dU5lgqt5mtWG2YmVAVsKKcWhMhM4tWKCNRoJjp$J6jsGVs5dUI6UyoY4o8nKpRN2wfSAPnVj687xUfdwGOAROYoH82HZ53h8HL5y2kszQg0L2FuiVcwfI08bSaKWTPyMsDBqEqzyjMeNGPtB7PUUz7sQc2pNLfQ1Gf7AegAS5u$b4HZzbOVSdR2GO1Mx3AjojRgA**; zjfr_ehiJwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTE4MjA0NTIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbW9iaWxlcGhvbmUiOiIxNTkyNzQwNzYzNSIsIm5iZiI6MTU0NzYwNTE5MSwiZXhwIjoxNTQ3NjkyMTkxLCJpc3MiOiJlSGkiLCJhdWQiOiJBbnkifQ.n-045fwWr8g7UU201DvSB-tgmhaklHu1rVDPbNhPI7M; zjfr_mu=UlCb1PpHX7ax$MB49TQFuN$8tAhTGZlQ/xwfQsu$ZU$oU9WF4wC0va/PJua3L9DS7xdjYlgH$tG7rL0BzBtUPQObPbBqv62cTl9MeA$y3tU2aPE$PL$PIjH518gteBqIVmNWyfWF8xDZ802DllBkxg**; zjfr_token=3fccbfa994a6483ba94a3c22504ed795; CropId=; HomeSource=SelfHome; JsonOrder={"PassLst":[{"AccountNo":null,"BookerCellPhone":"15927407635","PassengerCellPhone":"15927407635","PassengerName":"","PassengerEmail":""}],"UseDt":"2019-01-16 12:39:56","PickAddr":null,"DestAddr":null,"pickUpCity":"%e4%b8%8a%e6%b5%b7","destCity":"%e4%b8%8a%e6%b5%b7","Days":null,"CarTypeList":[{"CarTypeLevelId":2,"CarTypeLevelName":"%e7%bb%8f%e6%b5%8e%e5%9e%8b5%e5%ba%a7","CarTypeLevelNameEn":"Economy+Car+5+seats","ImageUrl":"https://image.1hai.cn/chauffeur/carNew/jjxjc.png","DefaultCarTypeId":141,"DefaultCarTypeName":"%e8%8d%a3%e5%a8%81550%e3%80%81%e5%a4%a7%e4%bc%97%e6%9c%97%e9%80%b8%e6%88%96%e5%90%8c%e7%ad%89%e7%ba%a7%e8%bd%a6%e5%9e%8b"},{"CarTypeLevelId":3,"CarTypeLevelName":"%e8%88%92%e9%80%82%e5%9e%8b5%e5%ba%a7","CarTypeLevelNameEn":"Comfortable+Car+5+seats","ImageUrl":"https://image.1hai.cn/chauffeur/carNew/ssxjc.png","DefaultCarTypeId":3,"DefaultCarTypeName":"%e5%ae%9d%e9%a9%ac3%e7%b3%bb%e3%80%81%e5%a4%a7%e4%bc%97%e5%b8%95%e8%90%a8%e7%89%b9%e6%88%96%e5%90%8c%e7%ad%89%e7%ba%a7%e8%bd%a6%e5%9e%8b"},{"CarTypeLevelId":4,"CarTypeLevelName":"%e8%b1%aa%e5%8d%8e%e5%9e%8b5%e5%ba%a7","CarTypeLevelNameEn":"Elite+Car+5+seats","ImageUrl":"https://image.1hai.cn/chauffeur/carNew/jyxjc.png","DefaultCarTypeId":171,"DefaultCarTypeName":"%e5%ae%9d%e9%a9%ac5%e7%b3%bb%e3%80%81%e5%a5%a5%e8%bf%aaA6L%e6%88%96%e5%90%8c%e7%ad%89%e7%ba%a7%e8%bd%a6%e5%9e%8b"},{"CarTypeLevelId":7,"CarTypeLevelName":"%e5%95%86%e5%8a%a1%e5%9e%8b7%e5%ba%a7","CarTypeLevelNameEn":"Van+7+seats","ImageUrl":"https://image.1hai.cn/chauffeur/carNew/ssxswc.png","DefaultCarTypeId":2,"DefaultCarTypeName":"%e5%88%ab%e5%85%8bGL8%e6%88%96%e5%90%8c%e7%ad%89%e7%ba%a7%e8%bd%a6%e5%9e%8b"}],"CarTypeLevelId":2,"CarType":141,"CarTypeLevelDesc":"%e7%bb%8f%e6%b5%8e%e5%9e%8b5%e5%ba%a7","BookerPhone":"15927407635","BookerName":null,"PaymentType":null,"CardNo":null,"VipCardId":null,"CardType":null,"ChgsID":null,"PriceStr":"","IsModify":null,"OrderNo":null,"EncryptOrderNo":null,"AccountType":"P","UseType":"P","TripType":"JJ","ListConfig":null,"FightNo":null,"Source":null,"UseCouponID":"-1","CouponAmount":0.0}; ai_session=rB8dm|1547605793594|1547605796842.4',
    Host: "mzhuanche.1hai.cn",
    Pragma: "no-cache",
    Referer:
      "https://mzhuanche.1hai.cn/Address/City?CityName=%E4%B8%8A%E6%B5%B7&AddrType=PickAir&InitialUrl=%7e%2f..%2f..%2fOrder%2fStep1%3fTripType%3dJJ",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      " Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
  }
};
// const jichang = [];
function requestFun(data, id) {
  return new Promise(function(resolve, reject) {
    request(data, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var airport = [];
        var $ = cheerio.load(body);
        $(".address-list")
          .find("li")
          .find("p")
          .each(function(ele) {
            airport.push(
              $(this)
                .text()
                .trim()
            );
          });
        var obj = {
          id,
          airport
        };
        resolve(obj)
      }
    });
  });
}
function test() {
  let requests = [];
  for (const item of citys) {
    options.url = baseUrl(item.name);
    requests.push(requestFun(options, item.id));
  }
  return requests;
}
Promise.all(test()).then(datas => {
  console.log("执行完成");
  fs.appendFile("jichang.txt", JSON.stringify(datas, null, 4), err => {
    if (err) {
      console.log(err);
    }
  });
});
