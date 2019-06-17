let fs = require('fs');
let path = require('path');
let rootPath = path.resolve('./countries');
let MD5 = require('./md5').MD5;
let http = require('http');
let data = [];
readFile(rootPath, data);

function readFile(filePath) {
    fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err);
            } else {
                files.forEach((filename) => {
                    let fileDir = path.join(filePath, filename);
                    fs.stat(fileDir, function (err, stats) {
                        let extname = path.extname(fileDir);
                        let isDirectory = stats.isDirectory();
                        if (extname === '.json' || isDirectory) {
                            let isFile = stats.isFile();
                            if (isFile) {
                                let fullFilePath = path.resolve(filePath, filename);
                                fs.open(fullFilePath, 'r', function (err, fd) {
                                    fs.readFile(fullFilePath, function (err, bytes) {
                                        for(let i in JSON.parse(bytes).features){
                                            let properties = JSON.parse(bytes).features[i].properties;
                                            let geo = JSON.parse(bytes).features[i].geometry;
                                            baiduTranslate(properties.name).then((result)=>{
                                                if (geo.type === "MultiPolygon") {
                                                    data.push({name: result.trans_result[0].dst, value: geo.coordinates[0][0][0]})
                                                } else {
                                                    data.push({name: result.trans_result[0].dst, value: geo.coordinates[0][0]})
                                                }
                                                fs.writeFile('../../src/components/CI/CI0801/MapData/worldCitiesData.js', "export default "+JSON.stringify(data), function (err) {
                                                        if (err) {
                                                            console.warn(err)
                                                        }
                                                    }
                                                )
                                            });
                                        }

                                    })
                                })
                            } else {
                                let newPath = path.join(filePath, filename)
                                readFile(newPath)
                            }
                        }
                    })
                });
            }
        }
    )
}

function baiduTranslate(q) {
    let appId = "20180606000172695";
    let from = 'en';
    let to = 'zh';
    let secretKey = "eTISNwya_Ut_gouIIUg6";
    let salt = "1435660288";
    let MD5OriginStr = appId + q + salt.toString() + secretKey;
    let MD5Str = MD5(MD5OriginStr);
    let requestUrl = "http://api.fanyi.baidu.com/api/trans/vip/translate?q=" + q + "&from="+from+"&to="+to+"&appid=20180606000172695&salt=1435660288&sign=" + MD5Str;
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
                    reject(e)
                }
            })
        })
    });
}

