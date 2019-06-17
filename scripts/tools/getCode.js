let fs = require('fs');
let path = require('path');
let dir = path.resolve();
let conponentFilePath = path.join(dir, "src/components");
let modelFilePath = path.join(dir, "src/components");
let writeFilePath=path.join(dir,"codes");
const readline=require('readline');

function readFile(rootPath){
    fs.readdir(rootPath,(err,files)=>{
        if(err){
            console.warn(err)
        }else{
            files.forEach((filename)=>{
                let pathname=path.join(rootPath,filename);
                fs.stat(pathname,function(err,stats){
                    if(err){
                        console.warn(err)
                    }else{
                        var isFile=stats.isFile();
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            const rl = readline.createInterface({
                                input: fs.createReadStream(pathname),
                                output: process.stdout
                            });
                            rl.on('line',(input)=>{
                                let random=parseInt(10*Math.random(),10);
                                console.log(random)
                                if(random===5){
                                    fs.appendFile(writeFilePath,input+'\n')
                                }
                            })
                        }
                        if(isDir){
                            readFile(pathname);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            })
        }
    })
}

readFile(conponentFilePath);