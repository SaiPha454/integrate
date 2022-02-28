const mongoClient = require('../clients/mongodb_client');
const mongodb = require('mongodb');
const redisClient = require('../clients/redis_client');

const redisKeys = require('../redis-keys/redis-keys-gen')

const userCollection = mongoClient.db('integrate').collection('users');
const songCollection = mongoClient.db('integrate').collection('songs');
const artistCollection = mongoClient.db('integrate').collection('artists');


const REDIS_CAHCE_EXP_SEC = 60;
const SONG_SEARCH_LIMIT = 15;
const ARTIST_SEARCH_LIMIT = 8;
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

/**
 * Get the album contents of the artist
 * @param {ObjectId} id - artist id
 * @param {ObjectId} album_id - album id
 * 
 * @returns
 */
const getArtistAlbum = async (id, album_id)=>{
    let redis_key = redisKeys.redis_get_artist_album_contents_key(id, album_id);

    let album = await redisClient.get(redis_key);
    
    if(album != null){
        
        return JSON.parse(album);
    }

    id = mongodb.ObjectId(id);
    album_id= album_id === 'studio' ? 'studio' : mongodb.ObjectId(album_id);

    album = await songCollection.find({'artist._id':id,'album._id':album_id});
    album = await album.toArray();

    let redisSetAlbum = await redisClient.setex(redis_key,REDIS_CAHCE_EXP_SEC,JSON.stringify(album));

    return album;
}

/**
 * Search for the songs or artists
 * @param {string} query - the text the user used to search for songs or artists
 * 
 * @returns 
 */
const search= async (query)=>{
    queryPattern = new RegExp(`${query}`,'im');
    
    let songs = await songCollection.find({
        'title':{'$regex':queryPattern}
    }).limit(SONG_SEARCH_LIMIT)
    songs = await songs.toArray();
    
    let artists = await artistCollection.find({
        'name':{'$regex':queryPattern}
    },{projection:{'recent_released_songs':0,albums:0}}).limit(ARTIST_SEARCH_LIMIT)
    artists = await artists.toArray();

    return {
        songs,
        artists
    };
}

module.exports={
    addToFav,
    findById,
    like,
    dislike,
    getArtistStudio,
    getArtistAlbum,
    search
}