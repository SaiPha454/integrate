
/**
 * Generate the redis song like key format . The data type is set
 * @param {ObjectId} id song id
 * 
 * @returns 
 */
const redis_like_key = (id)=>{
    return `like:song:${id}`;
}

/**
 * Generate the redis key for getting the contents of the artist studio or profile
 * @param {Object} id - artist id
 * 
 * @returns 
 */
const redis_get_artist_studio_key = (id)=>{
    return `cache:artist:${id}`;
}

/**
 * Generate the redis key for getting the album contents of the artist
 * @param {ObjectId} id - artist id
 * @param {ObjectId} album_id - album id
 * 
 * @returns 
 */
const redis_get_artist_album_contents_key = (id, album_id)=>{
    return `cache:artist:${id}:album:${album_id}`;
}

module.exports={
    redis_like_key,
    redis_get_artist_studio_key,
    redis_get_artist_album_contents_key
}