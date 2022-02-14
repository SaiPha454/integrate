

const Redis = require('ioredis');
const fs = require('fs');


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
        ca: fs.readFileSync('./certs/redis/ca.crt'),
        cert:fs.readFileSync('./certs/redis/redis_server_crt_signed_by_ca.crt'),
        key: fs.readFileSync('./certs/redis/server.key'),
        rejectUnauthorized: false
    },
    sentinelTLS:{
        ca: fs.readFileSync('./certs/redis/ca.crt'),
        cert:fs.readFileSync('./certs/redis/redis_server_crt_signed_by_ca.crt'),
        key: fs.readFileSync('./certs/redis/server.key'),
        rejectUnauthorized: false
    },
    username: process.env.redis_username,
    password: process.env.redis_password
});


//Detect if the connection is initiate everytime.
console.log('Initiate Redis Connection!');

// ping check connection
redis.ping('hi',(err,res)=>{
    console.log('Redis connection is establised . Response ok.');
})

module.exports=redis;