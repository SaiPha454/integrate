

const mongodb = require('mongodb')

let app = require('../../routes/index');
let request = require('supertest');

const mongoCli = require('../../src/daos/imple/clients/mongodb_client');
const redisCli = require('../../src/daos/imple/clients/redis_client')


let artist = {
    name: "nang Cherry Ko",
    email: "cherryko@gmail.com",
    password: "password", 
    status:   "active",
    registered: false
}

let db;
let artist_list_collection;
let artistID;

beforeAll(async () => {

    db = await mongoCli.db('test');
    artist_list_collection = await db.collection('artist-list');
    
});


afterAll(async () => {
    await mongoCli.close();
    await redisCli.quit();
});

beforeEach(async () => {
    let insertedArtist =await artist_list_collection.insertOne(artist);
    artistID = (insertedArtist.insertedId).toString();
   
});

afterEach( async () => {
    
    await artist_list_collection.deleteOne({'_id': mongodb.ObjectId(artistID)});
    
});

describe('Post : admin/artists/register', () => {
    
    test('confirm artist Acc request',async () => {

        let {password, ...expectedObj} = artist;
        expectedObj = {
            ...expectedObj,
            registered: true,
            _id: artistID
        }
    
        const res = await request(app)
        .post('/admin/artists/register')
        .send({
            id: artistID
        });
        
        expect(res.body.status).toBe(200);
        expect(res.body.data).toEqual(expectedObj);
    
    });

    test('confirm artist Acc request with wrong id', async () => {

       await artist_list_collection.deleteOne({'_id': mongodb.ObjectId(artistID)});

        const res = await request(app)
        .post('/admin/artists/register')
        .send({
            id: artistID
        });

        expect(res.body.status).toBe(400);

    });
});


describe('Post : admin/artists/activate', () => {
    
    test('activate artist Acc', async () => {

        const res = await request(app)
        .post('/admin/artists/activate')
        .send({
            id: artistID
        });

        expect(res.body.status).toBe(200);
        expect(res.body.data.status).toBe('active')
    });

    test('activate artist Acc with wrong id', async () => {

        await artist_list_collection.deleteOne({'_id': mongodb.ObjectId(artistID)});

        const res = await request(app)
        .post('/admin/artists/activate')
        .send({
            id: artistID
        });

        expect(res.body.status).toBe(400);
    });
});


describe('Post : admin/artists/burn', () => {
    test('activate artist Acc', async () => {

        const res = await request(app)
        .post('/admin/artists/burn')
        .send({
            id: artistID
        });

        expect(res.body.status).toBe(200);
        expect(res.body.data.status).toBe('burn');
    });

    test('activate artist Acc with wrong id', async () => {

        await artist_list_collection.deleteOne({'_id': mongodb.ObjectId(artistID)});

        const res = await request(app)
        .post('/admin/artists/burn')
        .send({
            id: artistID
        });

        expect(res.body.status).toBe(400);
    });
});

describe('Post : admin/artists', () => {
    
    test('fetch list of artists',async () => {
        
        let res = await request(app)
        .post('/admin/artists');

        expect(res.body.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]._id).toBe(artistID);
        
    });
});



    




