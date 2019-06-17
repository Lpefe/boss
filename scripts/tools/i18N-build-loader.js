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

async function i18N_build_loader(content, map, meta) {
    let feat = getFileFeature(map.sourcesContent[0]);
    let ast = babylon.parse(content, {sourceType: "module"});
    let callback = this.async();
    const options = getOptions(this);
    try{
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
                                    method: "GET",
                                    withCredentials: true,
                                    params: {
                                        word: path.node.value,
                                        lang: options.lang,
                                        role: feat[0],
                                        feat: feat[1],
                                    }
                                };
                                let nodeAndOption={
                                    option:option,
                                    node:path.node
                                };
                                requestArr.push(nodeAndOption);
                            }
                        }
                    }
                }
            });
            while (requestArr.length > 0) {
                const nodeAndOption = requestArr.shift();
                const p = await Axios(nodeAndOption.option).then((data)=>{
                    nodeAndOption.node.value=data.data.result
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
            })
        } else {
            try{
                let result = generate(ast, {
                    "jsescOption": {
                        "minimal": true
                    }
                });
                callback(null, result.code)
            }catch(err){
                console.error(err)
            }
        }
    }catch(err){
        console.error(`error:${feat[0]}-${feat[1]}`,err)
    }
}

module.exports = i18N_build_loader;