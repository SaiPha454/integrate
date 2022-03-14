// //config the env variables
// require('dotenv').config()


// const {MongoClient} = require('mongodb');
// const mongodb = require('mongodb')

// let admin_artist = require('../../src/daos/imple/admin/admin_artists_imple');
// const mongoCli = require('../../src/daos/imple/clients/mongodb_client');


// const testUri= `mongodb://${process.env.mongo_username}:${process.env.mongo_password}@127.0.0.1:28017,localhost:28018,localhost:28019?tls=true`;

// const testClient = new MongoClient(testUri,{
//     tlsCAFile: 'D:/Learn Nodjs/Integrate/src/src/daos/imple/clients/certs/mongo/ca-chain-bundle.cert.pem',
//     tlsCertificateKeyFile: 'D:/Learn Nodjs/Integrate/src/src/daos/imple/clients/certs/mongo/client_crt.pem'
// });

// let artist = {
//     name: "nang Cherry Ko",
//     email: "cherryko@gmail.com",
//     password: "password", 
//     status:   "active",
//     registered: false
// }

// let db;
// let artist_list_collection;
// let artistID;

// beforeAll(async () => {
    
//     await testClient.connect();
    
//     db = await testClient.db('test');
//     artist_list_collection = await db.collection('artist-list');
    
// });


// afterAll(async () => {
//     await mongoCli.close();
//     await testClient.close();
    
// });

// beforeEach(async () => {
//     let insertedArtist =await artist_list_collection.insertOne(artist);
//     artistID = (insertedArtist.insertedId).toString();
   
// });

// afterEach( async () => {
//     await artist_list_collection.deleteOne({'_id': mongodb.ObjectId(artistID)});
    
// });

// test('insert : Confirm the artist acc request', async () => {
    
    
//    let res = await admin_artist.insert(artistID);
//    let artist = await artist_list_collection.findOne({'_id': mongodb.ObjectId(artistID)});
   
//    expect(res.modifiedCount).toBe(1);
//    expect(artist.registered).toBe(true);
  
// });

// test('findById : Get the artist acc details',async () => {
    
//     let {password, ...expected} = artist;

//     let res = await admin_artist.findById(artistID);

//     expect(res).toEqual(expected);
// });

// test('activate : activate the artist acc',async () => {

//     await artist_list_collection.updateOne({'_id': mongodb.ObjectId(artistID)}, {'$set': {'status': 'burn'}} )

//     let res = await admin_artist.activate(artistID);

//     let artist = await artist_list_collection.findOne({'_id': mongodb.ObjectId(artistID)});

//     expect(artist.status).toBe('active');
//     expect(res.modifiedCount).toBe(1);
// });

// test('burn : burn the artist acc',async () => {
    

//     let res = await admin_artist.burn(artistID);
//     let artist = await artist_list_collection.findOne({'_id': mongodb.ObjectId(artistID)});

//     expect(artist.status).toBe("burn");
//     expect(res.modifiedCount).toBe(1);

// });

// test('findAll : find all artists', async () => {
    
//     let res = await admin_artist.findAll();
//     res = await res.toArray();

//     let {password, ...expectedObj} = artist;
    
//     expect(res.length).toBeGreaterThan(0);
//     expect(res[0]).toEqual(expectedObj);
// });
    




