const userImple = require('../../imple/users/users_imple')

/**
 * Add a song the user's specified playlist or default playlist `fav`
 * @param {ObjectId} id - song id 
 * @param {ObjectId} user_id - user id
 * @param {ObjectId} playlist_id - playlist id (option) 
 * 
 * @returns {Promise}
 */
const addToFav= async (id,user_id,playlist_id)=> userImple.addToFav(id,user_id,playlist_id);

/**
 * Get the song with the given id
 * @param {ObjectId} id - song id 
 * 
 * @returns {Promise}
 */
const findById= async (id)=> userImple.findById(id);

/**
 * Give like reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
const like= async (id, user_id)=> userImple.like(id, user_id);

/**
 * Give dislike reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
 const dislike= async (id, user_id)=> userImple.dislike(id, user_id);

/**
 * Get the artist studio or profile contents . If cached in redis , retrive from redis and if not, from MongoDB and cache it.
 * @param {ObjectId} id - artist -id
 * 
 * @returns 
 */
const getArtistStudio= async (id)=> userImple.getArtistStudio(id); 

/**
 * Get the album contents of the artist
 * @param {ObjectId} id - artist id
 * @param {ObjectId} album_id - album id
 * 
 * @returns
 */
const getArtistAlbum= async (id, album_id)=> userImple.getArtistAlbum(id, album_id);

/**
 * Search for the songs or artists
 * @param {string} query - the text the user used to search for songs or artists
 * 
 * @returns 
 */
const search = async (query)=> userImple.search(query);

module.exports={
    addToFav,
    findById,
    like,
    dislike,
    getArtistStudio,
    getArtistAlbum,
    search
}