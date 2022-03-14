

const Redis = require('ioredis');
const fs = require('fs');

//get the current folder address path
let dirname = __dirname .replace("\\","/");

let dbIndex = process.env.NODE_ENV === 'production' ? 1 : 0;

// create new redis client connection
const redis = new Redis({
    sentinels:[
        {ip: "127.0.0.1",port:5200},
        {ip:"127.0.0.1",port:5201},
        {ip:"127.0.0.1",port:5202}

    ],
    name:"masterInstance",
    enableTLSForSentinelMode: true,
    tls:{
        ca: fs.readFileSync(dirname + '/certs/redis/ca.crt'),
        cert:fs.readFileSync(dirname + '/certs/redis/redis_server_crt_signed_by_ca.crt'),
        key: fs.readFileSync(dirname + '/certs/redis/server.key'),
        rejectUnauthorized: false
    },
    sentinelTLS:{
        ca: fs.readFileSync(dirname + '/certs/redis/ca.crt'),
        cert:fs.readFileSync(dirname + '/certs/redis/redis_server_crt_signed_by_ca.crt'),
        key: fs.readFileSync(dirname + '/certs/redis/server.key'),
        rejectUnauthorized: false
    },
    username: process.env.redis_username,
    password: process.env.redis_password,
    db: dbIndex
});


//Detect if the connection is initiate everytime.
console.log('Initiate Redis Connection!');

// ping check connection
redis.ping('hi',(err,res)=>{
    console.log('Redis connection is establised . Response ok.');
})

module.exports=redis;