let fs = require('fs');
let path = require('path');
let dir = path.resolve();
let filePath = path.join(dir, "src/locales/temp.json");
let MD5 = require('./md5').MD5;
let http = require('http');


function translateLocaleData() {
    const obj = JSON.parse(fs.readFileSync(filePath));
    let newObj = {};
    for (let key in obj) {
        newObj[key] = {id: key};
    }
    fs.writeFile('./src/locales/tempResult.json', JSON.stringify(newObj), (err) => {
        console.log(err)
    })
}


function baiduTranslate(q) {
    let appId = "20180831000201395";
    let from = 'auto';
    let to = process.argv[2];
    let secretKey = "OEX2akelzU8ctaXBR1xu";
    let salt = "1435660288";
    let MD5OriginStr = appId + q + salt.toString() + secretKey;
    let MD5Str = MD5(MD5OriginStr);
    let requestUrl = encodeURI("http://api.fanyi.baidu.com/api/trans/vip/translate?q=" + q + "&from=" + from + "&to=" + to + "&appid=" + appId + "&salt=1435660288&sign=" + MD5Str);
    return new Promise((resolve, reject) => {
        http.get(requestUrl, function (res) {
            let rawData = '';
            res.setEncoding('utf8');
            res.on('data', function (data) {
                return rawData += data;
            });
            res.on('end', function () {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                } catch (e) {
                    console.log(e)
                }
            })
        })
    });
}

translateLocaleData();


