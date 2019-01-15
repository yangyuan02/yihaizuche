const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const options = {
  url:
    "https://mzhuanche.1hai.cn/Address/City?CityName=%E5%8C%97%E4%BA%AC&AddrType=PickAir&InitialUrl=~%2f..%2f..%2fOrder%2fStep1%3fTripType%3dJJ", //获取period学段
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Cookie:
      "ASP.NET_SessionId=k3tbkajhrafeqjbo5lgns5to; __xsptplus604=604.1.1547517250.1547517250.1%232%7Cwww.baidu.com%7C%7C%7C%7C%23%23ZLKqh2aLT_bzLOW77CPri5Z1K_rolOi6%23; zjfr_showEntrance=showEntrance; zjfr_latitude=28; zjfr_logitude=131; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221684f37796262a-0771c54349d48f-2d604637-250125-1684f377963516%22%2C%22%24device_id%22%3A%221684f37796262a-0771c54349d48f-2d604637-250125-1684f377963516%22%2C%22props%22%3A%7B%7D%7D; zjfr_Token=549180279; zjfr_l=2%2B2soujuUW/54NAOL/Ne9VN9YWZkd5YZOkElRbLhaNQMckoxBIjNukbzChnPUagFyipO8fDHFq6xjG/jjDKj4jKw4VULQULAJN1xdm1ycyVH%2BlyoxKzx9WkN%2BhQASXrQUUHDDWhGtDFuvmbrsf5/xQ==; zjfr_CustomerInfo=%2BRMimuApY8vSXXzljHlQJhaqfPmZJApT1P0AL9HNrtbIb2ZECo%2BrzQ%2BDx/IFkFMD%2BsKR/W6Z7P/eFOdJ/7ogNg8UH/C0nhrMwj04F/G3zUzRojj02JWotxRSlACCk5Rzi0lmiQF/aotP2t2gT5YIq9wf3P6Pi4itPmvC4ZqpujthAqI8y3WPbv0ugxEPFRb52iZ7VlIlyuGzq/Q/N2tsIYQZfpLTSIQHyxuAwjPuONGE48pxoYHe4En%2Bpb0HK1RnbE8vzC%2B773HKcqVBp61AE/3msIL8iGZxgJo6Ac7sTV28A43z%2BBsWTfS%2B6W03kXtumWWzZCgkZ3Il7kNHBsFSTi1mCzFTsBG4XCjKjAEbk74M7FzVpzi4Xr7xobyQh%2BKxFs8E5vlDWRN2xEsreVA8m2bAH0APsYbn7G54GvdexcjP8ly90VmwPuX3WW6LWCR47LXrqFTunosOW6okk%2BdB4L6%2BTy9gQKpxnRG9V30ZtnRFBgDhEPAxs2ksITOZA5oMgJB89ocB2HuYx4RmGxreR6WbEu/1wgOR2wamAE%2BhSyjL/ZV%2B8MXSe6Xqxu8%2BH1yV6z5aSwzAw4NcglQc7xuJtD/tULyNee/zuk4cGg7xO3IECFUtzMcrBg==; zjfr_md=UlCdyOpHdbex$MAEo2dU5lgqt5mtWG2YmVAVsKKcWhMhM4tWKCNRoJjp$J6jsGVs5dUI6UyoY4o8nKpRN2wfSAPnVj687xUfdwGOAROYoH82HZ53h8HL5y2kszQg0L2S/9e$vQSamXJwqbTAvsvlzhvdkLMkRT2XouwpR0G$1ySbM9jMvrp/ctfy1gP9qdJ2xpM5fsYdQ/itgoGpXJTMEg**; zjfr_ehiJwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTE4MjA0NTIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbW9iaWxlcGhvbmUiOiIxNTkyNzQwNzYzNSIsIm5iZiI6MTU0NzUxNjc0OCwiZXhwIjoxNTQ3NjAzNzQ4LCJpc3MiOiJlSGkiLCJhdWQiOiJBbnkifQ.u6uAmcxllkw_pkGRyxeu8IjGLF5TZLlGiIHgMNe4Vdw; zjfr_mu=UlCb1PpHX7ax$MB49TQFuN$8tAhTGZlQ/xwfQsu$ZU$oU9WF4wC0va/PJua3L9DS7xdjYlgH$tG7rL0BzBtUPQObPbBqv62cTl9MeA$y3tU2aPE$PL$PIjH518gteBqIVmNWyfWF8xDZ802DllBkxg**; zjfr_token=70550361acb944189785fb315d66bdb0; ai_user=Ta2kp|2019-01-15T01:55:50.113Z; ai_session=gT04E|1547517350246|1547518897246.9",
    Host: "mzhuanche.1hai.cn",
    Pragma: "no-cache",
    Referer:
      "https://mzhuanche.1hai.cn/Address/PickAirport?CityName=%E5%8C%97%E4%BA%AC&AddrType=PickAir&InitialUrl=%7e%2f..%2f..%2fOrder%2fStep1%3fTripType%3dJJ",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      " Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
  }
};

request(options, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var citys = [];
    $(".city-list-bd").each(function(ele) {
      $(this)
        .find("li")
        .each(function(ele) {
          var city = $(this)
            .find("a")
            .text();
          citys.push(city);
        });
    });
    fs.appendFile("city.txt", JSON.stringify(citys, null, 4), err => {
      if (err) {
        console.log(err);
      }
    });
  }
});
