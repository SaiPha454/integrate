
/**
 * Generate the redis song like key format . The data type is set
 * @param {ObjectId} id song id
 * 
 * @returns 
 */
const redis_like_key = (id)=>{
    return `like:song:${id}`;
}

module.exports={
    redis_like_key
}