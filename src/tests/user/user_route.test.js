
const mongodb = require('mongodb')

let app = require('../../routes/index');
let request = require('supertest');

const mongoCli = require('../../src/daos/imple/clients/mongodb_client');
const redisCli = require('../../src/daos/imple/clients/redis_client');
const { redis_like_key } = require('../../src/daos/imple/redis-keys/redis-keys-gen');


let user = {
    name: "nang Cherry Ko",
    email: "cherryko@gmail.com",
    password: "password", 
    subscribes: [],
    saved_songIds: [],
    playlists: [
        {
            _id: mongodb.ObjectId('621851c5a43b47d190b5e9a4'),
            name: 'fav'
        }
    ]
}

let songs = [
    {
        "title": "Cherry Bloming",
        "mp3_file": "Cherry Blom mp3 file path",
        "artist": {
            "_id": "620b24ca7a8e534f10afb048",
            "name": "CherrySKy"
        },
        "album": {
            "_id": "studio",
            "name": "studio"
        },
        "released_date": "19-02-2022"
    },
    {
        "title": "ကောင်းကင်",
        "mp3_file": "43 mp3 file path",
        "artist": {
            "_id": {
                "$oid": "620b24ca7a8e534f10afb048"
            },
            "name": "CherrySKy"
        },
        "album": {
            "_id": "studio",
            "name": "studio"
        },
        "released_date": "28-02-2022"
    }
]

let artist = {
    "name": "CherrySKy",
    "albums": [{
        "_id": "studio",
        "name": "studio",
        "num_song": 4
    }, {
        "_id": {
            "$oid": "62106675a3b8edd66c5beb4a"
        },
        "name": "Cherry Album 1",
        "num_song": 1
    }],
    "recent_released_songs": [{
        "title": "ကောင်းကင်",
        "mp3_file": "43 mp3 file path",
        "artist": {
            "_id": {
                "$oid": "620b24ca7a8e534f10afb048"
            },
            "name": "CherrySKy"
        },
        "album": {
            "_id": "studio",
            "name": "studio"
        },
        "released_date": "28-02-2022",
        "_id": {
            "$oid": "621c5fd5a8acda1c37cbd771"
        }
    }, {
        "title": "ချယ်ရီ",
        "mp3_file": "43 mp3 file path",
        "artist": {
            "_id": {
                "$oid": "620b24ca7a8e534f10afb048"
            },
            "name": "CherrySKy"
        },
        "album": {
            "_id": "studio",
            "name": "studio"
        },
        "released_date": "28-02-2022",
        "_id": {
            "$oid": "621c5fc2a8acda1c37cbd770"
        }
    }]
}

let db;
let user_collection;
let song_collection;
let artist_collection;
let userId;
let songIds;

beforeAll(async () => {

    db = await mongoCli.db('test');
    user_collection = await db.collection('users');
    song_collection = await db.collection('songs')
    artist_collection= await db.collection('artists');
});


afterAll(async () => {

    await mongoCli.close();
    await redisCli.quit();
    
});

beforeEach(async () => {
    let insertUser =await user_collection.insertOne(user);
    let insertSongs= await song_collection.insert(songs);

    userId = (insertUser.insertedId).toString();
    songIds = insertSongs.insertedIds;
});

afterEach( async () => {
    await redisCli.flushall();
    await user_collection.deleteMany({});
    await song_collection.deleteMany({});
});


describe('Post : users/song/add-to-fav', () => {

    let uri = '/users/song/add-to-fav';

    test('add song to fav playlist',async () => {
        
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId
        });
        
        expect(res.body.status).toBe(200);

    });

    test('add song to fav playlist with wrong song id',async () => {
        
        await song_collection.deleteOne({'_id': songIds[0]});

        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId
        });
        
        expect(res.body.status).toBe(400);
        expect(res.body.message).toBe('Failt to add to playlist');
    });

    test('add song to fav playlist with non-exist playlist',async () => {
        
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId,
            playlist_id: mongodb.ObjectId().toString()
        });
        
        expect(res.body.status).toBe(400);
        expect(res.body.message).toBe('The specified playlist was not found');
    });

    test('should not add the same song to same playlist',async () => {
        
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId
        });
        
        
        res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId
        });

        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('This song already exists in playlist');

    });
});

describe('Post : users/song/like', () => {
    let uri = '/users/song/like';

    test('like a song', async () => {
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });
        
        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Like successfully');
    });

    test('should not able to like the same song again', async () => {
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });

        res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });

        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Already liked the song');
    });

});

describe('Post : users/song/dislike', () => {
    let uri = '/users/song/dislike';

    test('dislike a song', async () => {

        await redisCli.sadd(redis_like_key(songIds[0].toString()) , userId.toString() );

        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });
        
        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Dislike successfully');
    });

    test('should not able to dislike the same song again', async () => {
        let res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });

        res = await request(app)
        .post(uri)
        .send({
            id: songIds[0].toString(),
            user_id: userId.toString()
        });

        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Already disliked the song');
    });

});

    
describe('Get : users/artists/:id/studio', () => {
    
    let uri;

    beforeEach(async () => {
        let  id = await artist_collection.insertOne(artist);
        uri = `/users/artists/${id.insertedId.toString()}/studio`;
    });
    afterEach(async () => {
        await artist_collection.deleteOne({'_id': artist._id})
    });
    
    
    test('Get the artist studio contents',async () => { 
        
        let res = await request(app)
        .get(uri);

        expect(res.body.status).toBe(200);
        
    });

    test('Get the artist studio contents from redis cache',async () => { 
        
        let res = await request(app)
        .get(uri);

        res = await request(app)
        .get(uri);

        expect(res.body.status).toBe(200);
        expect(res.body.data).toBeDefined();
        
    });

    test('Should not able to get the artist studio contents with wrong id',async () => { 
        
        uri = '/users/artists/6210688ea3b8edd66c5beb4c/studio';
        let res = await request(app)
        .get(uri);
        
        expect(res.body.status).toBe(200);
        expect(res.body.data).toBeUndefined();
        
        
    });
});



