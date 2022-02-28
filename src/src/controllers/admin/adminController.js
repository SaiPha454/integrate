const {commonErrorResponse, commonResponse}= require('../commonController/commonController');

const { insert, findById, activate, burn, findAll } = require("../../daos/interface/admin/admin_artists_interface")


/**
 * Confirm the artist account registeration request
 * @param {ObjectId} id - artist id 
 * 
 * @returns
 */
const register= async (req,res) =>{
    let id= req.body.id;

    let confirm_artist= await insert(id);

    if(confirm_artist.modifiedCount == 0 && confirm_artist.matchedCount == 0){
        return res.send(commonResponse(400,'The account register request was not found'));
    }
    
    let artist= await findById(id);

    let meta={
        id: req.body.id
    }
    return res.send(commonResponse(200,'Confirmation is successful',meta,artist));
    
}

/**
 * Activate the artist account
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const activateArtistAccount= async (req,res)=>{

    let id= req.body.id;

    let activate_artist= await activate(id);

    if(activate_artist.modifiedCount == 0 && activate_artist.matchedCount == 0){
        return res.send(commonResponse(400,'The artist account was not found'));
    }

    let artist= await findById(id);

    let meta={
        id: req.body.id
    }
    return res.send(commonResponse(200,'Activated successfully',meta,artist));
}

/**
 * Burn the artist account
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const burnArtistAccount= async (req,res)=>{
    let id= req.body.id;

    let burn_artist= await burn(id);

    if(burn_artist.modifiedCount == 0 && burn_artist.matchedCount == 0){
        return res.send(commonResponse(400,'The artist account was not found'));
    }

    let artist= await findById(id);

    let meta={
        id: req.body.id
    }

    return res.send(commonResponse(200,'Burned successfully',meta,artist));

}

/**
 * Get the list of all artists
 * 
 * @returns
 */
const getArtistList= async (req,res)=>{
    
    let artists= await findAll();

    artists= await artists.toArray();

    let meta={
        'total': artists.length
    }

    return res.send(commonResponse(200,'Loaded successfully',meta,artists));
    
}


module.exports={
    register,
    activateArtistAccount,
    burnArtistAccount,
    getArtistList
}