const mongodb = require('mongodb')
const mongoClient = require('../../daos/imple/clients/mongodb_client');
const { commonResponse, commonErrorResponse } = require('../commonController/commonController');

/*
  create artists collection on Moongodb server if not exists and return the conneciton
*/
let artistCollection = mongoClient.db('integrate').collection('artists');


/** Create an album of the specified artist
@param {string} name - album name (req)
@param {ObjectID} artist_id - artist_id (req)

@return {object}
*/
const createAlbum=async (req,res)=>{

    let req_body = req.body;
    let album_name = req_body.name;
    let artist_id = mongodb.ObjectId(req_body.artist_id);

    let identifier = {'_id':artist_id};
    let data={
        '_id':mongodb.ObjectId(),
        'name':album_name,
        'num_song':0
    }
    let operator = {'$push':{ "albums":data } }

    let created_album = await artistCollection.updateOne(identifier,operator); 

    if(created_album.modifiedCount === 1){

        let resp_meta={
            artist_id: artist_id,
            album_id: data._id
        }

        let resp_data=data;

        let response = commonResponse(200,'Created album successfully',resp_meta,resp_data);

        return res.send(response);
    }

    
    return res.send(commonErrorResponse(400,'Fail to create album'))
}

/**
 * Update an album of the specified one
 * @param {ObjectID} id - album id
 * @param {objectID} artist_id - artist id
 * @param {string} name - the new album name
 * 
 * @returns
 * 
 */
const updateAlbum= async (req,res)=>{
    let album_id = mongodb.ObjectId(req.body.id);
    let artist_id = mongodb.ObjectId(req.body.artist_id);
    let new_name = req.body.name;

    let identifier= {'_id':artist_id, 'albums._id': album_id };
    let operator= {'$set':{'albums.$.name':new_name}}
    let updated_album = await artistCollection.updateOne(identifier,operator);

    if(updated_album.modifiedCount === 1){

        let resp_meta={
            artist_id: artist_id,
            album_id: album_id
        }

        let data = await artistCollection.findOne({'_id':artist_id}, {albums:1} )

        data.albums.map(element=>{
            if(album_id.toString() === element._id.toString() ){
                data = element;
            }
        })

        let resp_data=data;

        let response = commonResponse(200,'Updated album successfully',resp_meta,resp_data);

        return res.send(response);
    }
    
    if(updated_album.matchedCount == 1 && updated_album.modifiedCount ==0){
        return res.send(commonErrorResponse(200,'Album is already up to date'));
    }
    if(updated_album.matchedCount == 0){
        return res.send(commonErrorResponse(400,'Artist with the specified album is not found '));
    }
    
    return res.send(commonErrorResponse(400,'Fail to update album'));
}

/**
 * Delete album with the specified id
 * @param {ObjectId} id - the album id
 * @param {ObjectId} artist_id - artist id
 */
const deleteAlbum=async (req,res)=>{
    let album_id = mongodb.ObjectId(req.body.id);
    let artist_id = mongodb.ObjectId(req.body.artist_id);

    let identifier={'_id':artist_id};
    let operator = {'$pull':{'albums':{'_id':album_id}} };
    let deleted_album= await artistCollection.updateOne(identifier,operator);

    if(deleted_album.modifiedCount ==1){

        let meta = {
            _id: album_id
        }
        return res.send(commonResponse(200,'Deleted album successfully',meta));
    }
    
    return res.send(commonErrorResponse(400,'Fail to delete album or album do not exist'));
}

/**
 * Get the list of albums of the specified artist
 * 
 * @param {ObjectId} artist_id - artist id 
 * 
 * @returns
 */
const getListOfAlbums=async (req,res)=>{
    let id= mongodb.ObjectId(req.body.artist_id);

    let albums = await artistCollection.findOne({'_id':id},{projection:{'albums':1}})
    
    if(albums){
        let data=albums.albums;
        let meta = {
            artist_id: id,
            total: data.length
        }
        
        return res.send(commonResponse(200,'Loaded albums successfully',meta,data));
    }

    return res.send(commonResponse(400,'Fail to get albums'));

}


module.exports={
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getListOfAlbums
}