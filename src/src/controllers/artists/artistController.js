const mongodb = require('mongodb')
const mongoClient = require('../../daos/imple/clients/mongodb_client');
const { commonResponse, commonErrorResponse } = require('../commonController/commonController');

/*
  create collections on Moongodb server if not exists and return the conneciton
*/
const artistCollection = mongoClient.db('integrate').collection('artists');
const songCollection = mongoClient.db('integrate').collection('songs'); 

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

/**
 * Upload a song to the artist studio
 * @param {string} title - song name
 * @param {string} mp3_file - mp3 file path
 * @param {ObjectId} artist_id - artist id 
 * @param {ObjectId} album_id - album id which will be uploaded to (option). If not specified, default `studio` album will be used instead
 * 
 * @returns
 */
const uploadSong= async (req,res)=>{

    let req_body= req.body;

    let title= req_body.title;
    let artist_id= mongodb.ObjectId(req_body.artist_id);
    let mp3_file= req_body.mp3_file;

    let artist_name;
    let album_id;
    let album_name;

    let artist = await artistCollection.findOne({'_id':artist_id});
    if(artist == null){
        return res.send(commonErrorResponse(400,'The specified artist does not exist'));
    }

    artist_name= artist.name;

    if(req_body.album_id){
        album_id= mongodb.ObjectId(req_body.album_id);

        artist.albums.map(element=>{
            if(element._id.toString() === album_id.toString()){
                album_name= element.name;
            }
        })

    }else{
        album_id= 'studio';
        album_name='studio';
    }

    //song need to be uploaded to both `songs` collection and `artists` collection
    let session = mongoClient.startSession();

    const transactionOptions= {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    }

    let response_data;
    let response_meta;

    try{
        await session.withTransaction(async ()=>{
            let released_date= new Date().toJSON().split('T')[0];
            released_date=  released_date.split('-').reverse().join('-');

            let data={
                title,
                mp3_file,
                artist:{
                    '_id':artist_id,
                    'name':artist_name
                },
                album:{
                    '_id':album_id,
                    'name':album_name
                },
                released_date:released_date
            }

            const songs_col=await songCollection.insertOne(data,{session});

            data._id=songs_col.insertedId;

            let identifier={
                '_id': artist_id,
                'albums._id':album_id
            };
            let operator={
                '$push':{
                    'recent_released_songs':{
                        '$each':[data],
                        '$sort':{'_id':-1},
                        '$slice':2
                    }
                },
                '$inc':{'albums.$.num_song':1}
            }
            const artist_col=await artistCollection.updateOne(identifier,operator,{session});

            response_meta={
                song_id: data._id,
                album_id,
                artist_id
            }
            response_data=data;

        } , transactionOptions)
    }
    catch(error){
        if(error){
            return res.send(commonErrorResponse(400,'Fail to upload song'));
        }
    }
    finally{
        await session.endSession();
    }


    return res.send(commonResponse(200,'Uploaded song successfully',response_meta,response_data));

}


const updateSong= async (req,res)=>{

}

const deleteSong = async (req,res)=>{

}

const getListOfSongs= async (req,res)=>{

}


module.exports={
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getListOfAlbums,
    uploadSong,
    updateSong,
    deleteSong,
    getListOfSongs
}