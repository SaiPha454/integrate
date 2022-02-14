
const {MongoClient} = require('mongodb')


const uri= `mongodb://${process.env.mongo_username}:${process.env.mongo_password}@127.0.0.1:28017,localhost:28018,localhost:28019?tls=true`;

const client = new MongoClient(uri,{
    tlsCAFile: 'D:/Learn Nodjs/Integrate/src/src/daos/imple/clients/certs/mongo/ca-chain-bundle.cert.pem',
    tlsCertificateKeyFile: 'D:/Learn Nodjs/Integrate/src/src/daos/imple/clients/certs/mongo/client_crt.pem'
});


client.connect();
//Detect if the connection is initiate everytime.
console.log('Initiate Mongo Connection!');

async function checkConnection(){
    let con =await client.db('admin').command({ping:1});
    
    if(con.ok == 1){
        console.log('connection is successful');
    }else{
        console.log("connection is fail")
    }
}


checkConnection();

module.exports=client;