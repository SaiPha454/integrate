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

module.exports={
    addToFav,
    findById
}