const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('@babel/generator').default;
const Axios = require('axios');


async function i18N_dev_loader(content) {
    let callback = this.async();
    let ast = babylon.parse(content, {sourceType: "module"});

        let promiseArr = [];
        let requestArr = [];
        traverse(ast, {
            Literal(path) {
                if (path.node.value) {
                    let reg = new RegExp(/^@.*/);
                    if (reg.test(path.node.value)) {
                        if (path.node.value !== '@babel/runtime/regenerator') {
                            path.node.value = path.node.value.substring(1);
                        }
                    }
                }
            }
        });
        while (requestArr.length > 0) {
            const option = requestArr.shift();
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
        let result = generate(ast, {
            "jsescOption": {
                "minimal": true
            }
        });
        callback(null, result.code)

}

module.exports = i18N_dev_loader;