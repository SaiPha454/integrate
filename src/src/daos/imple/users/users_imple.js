const mongoClient = require('../clients/mongodb_client');
const mongodb = require('mongodb');
const redisClient = require('../clients/redis_client');

const redisKeys = require('../redis-keys/redis-keys-gen')

const userCollection = mongoClient.db('integrate').collection('users');
const songCollection = mongoClient.db('integrate').collection('songs');
const artistCollection = mongoClient.db('integrate').collection('artists');


const REDIS_CAHCE_EXP_SEC = 60;
/**
 * Add a song the user's specified playlist or default playlist `fav`
 * @param {ObjectId} id - song id 
 * @param {ObjectId} user_id - user id
 * @param {ObjectId} playlist_id - playlist id (option) 
 * 
 * @returns {Promise}
 */
const addToFav= async (id,user_id,playlist_id)=>{

     id = mongodb.ObjectId(id);
     user_id= mongodb.ObjectId(user_id);
     playlist_id = mongodb.ObjectId(playlist_id);

    let song= await songCollection.findOne({'_id':id});

    if(!song){
        return false;
    }

    let useridentifier= {
        '_id': user_id,
        'playlists._id':playlist_id
    }
    
    let userOperator={

        '$addToSet':{
            'saved_songIds': id,
            'playlists.$.songs':song
            
        }
    }

    return await userCollection.updateOne(useridentifier,userOperator);

}

/**
 * Get the song with the given id
 * @param {ObjectId} id - song id 
 * 
 * @returns {Promise}
 */
const findById= async (id)=>{

    id = mongodb.ObjectId(id);

    return await songCollection.findOne({'_id':id});
}

/**
 * Give like reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
const like = async (id,user_id)=>{

    let redis_key = redisKeys.redis_like_key(id);
    
    return await redisClient.sadd(redis_key,user_id);
}

/**
 * Give dislike reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
 const dislike = async (id,user_id)=>{

    let redis_key = redisKeys.redis_like_key(id);
    
    return await redisClient.srem(redis_key,user_id);
}

/**
 * Get the artist studio or profile contents . If cached in redis , retrive from redis and if not, from MongoDB and cache it.
 * @param {ObjectId} id - artist -id
 * 
 * @returns 
 */
const getArtistStudio= async (id)=>{

    let redis_key = redisKeys.redis_get_artist_studio_key(id);

    let artistStudio = await redisClient.get(redis_key);
    
    if(artistStudio != null){
        
        return JSON.parse(artistStudio);
    }
    
    id = mongodb.ObjectId(id);

    artistStudio = await artistCollection.findOne({'_id':id});

    let redisSetArtistStudio = await redisClient.setex(redis_key,REDIS_CAHCE_EXP_SEC,JSON.stringify(artistStudio));

    return artistStudio;
}

module.exports={
    addToFav,
    findById,
    like,
    dislike,
    getArtistStudio
}