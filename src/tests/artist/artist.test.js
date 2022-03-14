
const mongodb = require('mongodb')

let app = require('../../routes/index');
let request = require('supertest');

const mongoCli = require('../../src/daos/imple/clients/mongodb_client');
const redisCli = require('../../src/daos/imple/clients/redis_client');
const { redis_like_key } = require('../../src/daos/imple/redis-keys/redis-keys-gen');


let db;
let artist_collection;
let artistId;

let artist = {
    name: 'Cherry artists',
    num_songs: 25,
    albums: [
        {
            _id: 'studio',
            name: 'studio',
            num_song:0
        }
    ],
    recent_released_songs: []
}

beforeAll(async () => {
    db= await mongoCli.db('test');
    artist_collection= await db.collection('artists');

    let insertedArtist = await artist_collection.insertOne(artist);
    artistId = (insertedArtist.insertedId).toString();
});

afterAll(async () => {

    await artist_collection.deleteMany({});

    await mongoCli.close();
    await redisCli.quit();
});

describe('Route : /artists/albums', () => {
    let uri = '/artists/albums';
    describe('Post: /create', () => {
        let album_name = 'Cherry SKy album';

        test('create album',async () => {
            let res= await request(app)
            .post(uri + '/create')
            .send({
                name: album_name,
                artist_id: artistId
            });

            expect(res.body.status).toBe(200);
            expect(res.body.data.name).toBe(album_name);
            
        });

        test('create album with wrong artist id',async () => {
            let res= await request(app)
            .post(uri + '/create')
            .send({
                name: album_name,
                artist_id: '62185129a43b47d190b5e9a3'
            });
            expect(res.body.status).toBe(400);
        });
    });

    describe('Post: /update', () => {
        let new_album_name = 'Cherry Sky album 2';
        
        test('update album', async () => {
            
            let res = await request(app)
            .post(uri + '/update')
            .send({
                id: 'studio',
                name: new_album_name,
                artist_id: artistId
            });

            expect(res.body.status).toBe(200);
            expect(res.body.data.name).toBe(new_album_name);
        });

        test('should not update the same album again', async () => {
            
            let res = await request(app)
            .post(uri + '/update')
            .send({
                id: 'studio',
                name: new_album_name,
                artist_id: artistId
            });

            res = await request(app)
            .post(uri + '/update')
            .send({
                id: 'studio',
                name: new_album_name,
                artist_id: artistId
            });

            expect(res.body.status).toBe(200);
            expect(res.body.message).toBe('Album is already up to date');
        });

        test('should not able to update the album that do not exist', async () => {
            
            let res = await request(app)
            .post(uri + '/update')
            .send({
                id: mongodb.ObjectId().toString(),
                name: new_album_name,
                artist_id: artistId
            });

            expect(res.body.status).toBe(400);
            expect(res.body.message).toBe('Artist with the specified album is not found ');
        });
    });

    describe('Delete : /delete', () => {
        
        it('delete an album', async () => {
            
            //Action
            let res = await request(app)
            .delete(uri + '/delete')
            .send({
                id: 'studio',
                artist_id: artistId
            });

            //Assertion
            expect(res.body.status).toBe(200);
        });

        it('delete album with wrong id',async () => {

            //Action
            let res = await request(app)
            .delete(uri + '/delete')
            .send({
                id: mongodb.ObjectId().toString(),
                artist_id: artistId
            });
            //Assertion
            expect(res.body.status).toBe(400);
            expect(res.body.message).toBe('Fail to delete album or album do not exist');
        });
    });

});

