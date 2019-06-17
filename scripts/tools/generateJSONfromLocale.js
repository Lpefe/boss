const fs = require('fs');
const path = require('path');
let dir = path.resolve();
let filePathEN = path.join(dir, "src/locales/en.json");
let filePathTW = path.join(dir, "src/locales/zh-TW.json");
const objEN = JSON.parse(fs.readFileSync(filePathEN));
const objTW = JSON.parse(fs.readFileSync(filePathTW));

function modifyKey(key){
    const arr=key.split('.');
    return arr[1]
}
let objArr=[];
for (let key in objEN) {
    let newObj={};
    let newKey=modifyKey(key);
    newObj.zhCN=newKey;
    newObj.zhEN=objEN[key];
    objArr.push(newObj);
}

for(let key in objTW){
    for(let subKey in objArr){
        if(objArr[subKey].zhCN===modifyKey(key)){
            objArr[subKey].zhTW=objTW[key]
        }
    }
}

fs.writeFileSync('./src/locales/i18N.json',JSON.stringify(objArr))
