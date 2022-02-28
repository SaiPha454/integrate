const {commonErrorResponse, commonResponse} = require('../commonController/commonController')
const user_interface= require('../../daos/interface/users/user_interface');


const DEFAULT_PLAYLIST = '621851c5a43b47d190b5e9a4';

/**
 * Add a song the user's specified playlist or default playlist `fav`
 * @param {ObjectId} id - song id 
 * @param {ObjectId} user_id - user id
 * @param {ObjectId} playlist_id - playlist id (option) 
 * 
 * @returns 
 */
const addToFav= async (req,res)=>{

    let id= req.body.id;
    let user_id= req.body.user_id;
    let playlist_id= req.body.playlist_id ? req.body.playlist_id : DEFAULT_PLAYLIST;

    let added_to_fav= await user_interface.addToFav(id,user_id,playlist_id);
    
    if(!added_to_fav ){
        return res.send(commonResponse(400,'Failt to add to playlist'))
    }

    if(added_to_fav.modifiedCount == 0 && added_to_fav.matchedCount == 0){
        return res.send(commonErrorResponse(400,'The specified playlist was not found'))
    }

    if(added_to_fav.modifiedCount ==0 && added_to_fav.matchedCount == 1){
        return res.send(commonResponse(200,'This song already exists in playlist'));
    }

    let meta={
        id: req.body.id,
    }
    let data= await user_interface.findById(id);
    
    return res.send(commonResponse(200,'Added to playlist successfully',meta,data));
    
}

/**
 * Give like reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
const likeSong= async (req,res)=>{

    let id = req.body.id;
    let user_id= req.body.user_id;

    let like = await user_interface.like(id, user_id);

    if(like == 0){
        return res.send(commonResponse(200,'Already liked the song'));
    }

    return res.send(commonResponse(200,'Like successfully'));
}

/**
 * Give dislike reaction to a song
 * @param {ObjectId} id - song id
 * @param {ObjectId} user_id - user id
 * 
 * @returns
 */
const dislikeSong= async (req,res)=>{

    let id = req.body.id;
    let user_id= req.body.user_id;

    let dislike = await user_interface.dislike(id, user_id);

    if(dislike == 0){
        return res.send(commonResponse(200,'Already disliked the song'));
    }

    return res.send(commonResponse(200,'Dislike successfully'));
}

/**
 * Get the artist studio or profile contents . If cached in redis , retrive from redis and if not, from MongoDB and cache it.
 * @param {ObjectId} id - artist -id
 * 
 * @returns 
 */
const getArtistStudio= async (req,res)=>{
    let id = req.params.id;
    let artistStudio = await user_interface.getArtistStudio(id);
    
    let meta={
        id
    }
    return res.send(commonResponse(200,'Loaded successfully',meta,artistStudio))
}

/**
 * Get the album contents of the artist
 * @param {ObjectId} id - artist id
 * @param {ObjectId} album_id - album id
 * 
 * @returns
 */
const getArtistAlbum= async (req,res)=>{
        let id = req.params.id;
        let album_id = req.params.album_id ? req.params.album_id : 'studio';

        album = await user_interface.getArtistAlbum(id, album_id);

        let meta={
            id,
            album_id,
            total: album.length
        }

        return res.send(commonResponse(200,'Loaded successfully',meta,album));
}


module.exports={
    addToFav,
    likeSong,
    dislikeSong,
    getArtistStudio,
    getArtistAlbum
}