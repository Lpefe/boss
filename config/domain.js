const customUrl="http://192.168.29.89:7001";
/*const customUrl="http://127.0.0.1:7001";*/
module.exports={
    translateUrl:process.env.NODE_ENV==='Production'?"http://192.168.29.89:7001":customUrl
};