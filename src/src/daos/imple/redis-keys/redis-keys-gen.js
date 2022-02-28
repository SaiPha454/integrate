
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
 * 
 * @param {Object} id - artist id
 * 
 * @returns 
 */
const redis_get_artist_studio_key = (id)=>{
    return `cache:artist:${id}`;
}


module.exports={
    redis_like_key,
    redis_get_artist_studio_key
}