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

module.exports={
    addToFav,
    likeSong
}