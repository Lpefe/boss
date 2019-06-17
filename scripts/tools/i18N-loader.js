const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('@babel/generator').default;
const Axios = require('axios');
const {getOptions} = require('loader-utils');
const _ = require('lodash');

function getFileFeature(sourceContent) {
    let matchedFeat = sourceContent.match(/\*@.*\*/);
    if (matchedFeat) {
        return _.trim(matchedFeat[0].substring(2), '*').split('-')
    }
    return null;
}

async function i18N_loader(content, map, meta) {
    let feat = getFileFeature(map.sourcesContent[0]);
    const options = getOptions(this);
    let callback = this.async();
    let ast = babylon.parse(content, {sourceType: "module"});
    if (feat) {
        let promiseArr = [];
        let requestArr = [];
        traverse(ast, {
            Literal(path) {
                if (path.node.value) {
                    let reg = new RegExp(/^@.*/);
                    if (reg.test(path.node.value)) {
                        if (path.node.value !== '@babel/runtime/regenerator') {
                            path.node.value = path.node.value.substring(1);
                            const option = {
                                baseURL: options.baseURL,
                                url: options.url,
                                method: "POST",
                                withCredentials: true,
                                data: {
                                    words: path.node.value,
                                    role: feat[0],
                                    feature: feat[1],
                                    version: options.version
                                }
                            };
                            requestArr.push(option);
                        }
                    }
                }
            }
        });
        for (let option of requestArr) {
            const p = await Axios(option).then((res)=>{
                if(res.status!==200){
                    process.exit(1);
                    process.on('exit', (res) => {
                        console.log(`退出码: ${res}`);
                    });
                }
            });
            promiseArr.push(p);
        }
        Promise.all(promiseArr).then(() => {
            let result = generate(ast, {
                "jsescOption": {
                    "minimal": true
                }
            });
            callback(null, result.code)
        }).catch((err)=>{
            console.error(err)
        })
    } else {
        let result = generate(ast, {
            "jsescOption": {
                "minimal": true
            }
        });
        callback(null, result.code)
    }
}

module.exports = i18N_loader;