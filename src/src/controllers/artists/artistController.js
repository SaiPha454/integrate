const mongodb = require('mongodb')
const mongoClient = require('../../daos/imple/clients/mongodb_client');
const { commonResponse, commonErrorResponse } = require('../commonController/commonController');

let dbName = process.env.NODE_ENV === 'production' ? 'integrate' : 'test';
/*
  create collections on Moongodb server if not exists and return the conneciton
*/
const artistCollection = mongoClient.db(dbName).collection('artists');
const songCollection = mongoClient.db(dbName).collection('songs'); 

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
 * Get the list of songs of the specified album
 * @param {ObjectId} id - album id 
 * @param {ObjectId} artist_id - artist id
 * 
 * @returns
 */
const getSongsofAlbum= async (req,res)=>{

    let album_id= req.body.id == 'studio' ? 'studio' : mongodb.ObjectId(req.body.id);
    let artist_id= mongodb.ObjectId(req.body.artist_id);

    let songs= await songCollection.find({'album._id':album_id,'artist._id':artist_id});
    songs= await songs.toArray();

    let meta={
        album_id: album_id,
        artist_id: artist_id,
        total: songs.length
    }
    
    return res.send(commonResponse(200,'Loaded songs successfully',meta,songs))
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

/**
 *Update the song informs (album,title,mp3_file)
 * @param {ObjectId} id - the song id 
 * @param {ObjectId} artist_id - artist id
 * @param {ObjectId} album_id - the current album id (option)
 * @param {ObjectId} new_album_id - the new album id which will be changed to (option)
 * @param {string} new_title - the new song title (option)
 * @param {string} new_mp3_file - the new mp3 file path (option)
 *  
 * @returns 
 */

const updateSong= async (req,res)=>{

    let updateable_data= [{'key':'new_title','val':'title'},{'key':'new_mp3_file','val':'mp3_file'},{'key':'new_album_id','val':'album_id'}];


    let req_body= req.body;
    let artist_id= mongodb.ObjectId(req_body.artist_id);
    let song_id = mongodb.ObjectId(req_body.id);

    let update_data={};
    let old_album_num_song=0;
    let songBelongToAlbum=false;
    let new_album= null;
    let isRecentSong= false;

    let artist = await artistCollection.findOne({'_id':artist_id},{projection:{'recent_released_songs':1,'albums':1}});
    //check if the song is in the artist's recent_released_songs array
    artist.recent_released_songs.map(song=>{
        if(song._id.toString() === song_id.toString()){
            isRecentSong= true;
        }
        
    });

    let song= await songCollection.findOne({'_id':song_id});
    //map the incoming request with the ediable or updateable data. If request include changing album , the old album num_song must >0.
    updateable_data.map(element=>{
        
        if(req_body[element.key]){

            if(element.key === 'new_album_id' ){
                
                //retrive the new album  from the artist and check if the song really belong to the given album
                artist.albums.map(album=>{

                    if(album._id.toString() === req_body[element.val] ){
                        old_album_num_song = album.num_song;
                        if(song.album._id.toString() === req_body[element.val]){
                            songBelongToAlbum= true;
                        }
                    }
                    if(album._id.toString() === req_body[element.key].toString() ){

                        new_album= album;
                        
                    }
                })
                
            }else{
                update_data[element.val]= req_body[element.key];
            }

        }
    })

    //set the update operator which is `update_data`
    if(old_album_num_song > 0 && songBelongToAlbum && new_album != null){

        update_data.album={};
        update_data.album=new_album;
    }
    
    //start transaction session
    const session= mongoClient.startSession();

    let sessionOptions= {
        writeConcern:'majority'
    }

    try{
        await session.withTransaction(async ()=>{

            let songColIdentifier={
                '_id':song_id
            }
            let songColOperator={
                '$set':update_data
            }

            let songs_col=await songCollection.updateOne(songColIdentifier,songColOperator,{session});
            
            let identifier={'_id':artist_id};
            let operator={};

            if(isRecentSong){
                
                identifier['recent_released_songs._id']= song_id;
                let recent_update_data={};
                Object.keys(update_data).map(key=>{
                    
                    let recent_key=`recent_released_songs.$.${key}`;
                    recent_update_data[recent_key]=update_data[key];
                })

                operator[`$set`]= recent_update_data;
                
            }

            //hangling the inc and desc of the new album and old album only if the old_album_num_song > 0
            let arrayFilters=null;
            if(req_body.new_album_id && req_body.album_id && old_album_num_song >0){
                operator['$inc']={'albums.$[newalbum].num_song':1,'albums.$[oldalbum].num_song':-1};
                let newalbum_id= update_data.album._id === "studio" ? "studio" : mongodb.ObjectId(update_data.album._id);
                let oldalbum_id= req_body.album_id === "studio" ? "studio" : mongodb.ObjectId(req_body.album_id);
                arrayFilters=[ {'newalbum._id':newalbum_id} , {'oldalbum._id':oldalbum_id} ];
            }
            
            if(JSON.stringify(operator) != '{}' ){
                let artist_col=await artistCollection.updateOne(identifier,operator,{session,arrayFilters});
            }
            
            

        },sessionOptions)
    }
    catch(error){
        return res.send(commonErrorResponse(400,'Update Song fail.'));
    }
    finally{
       await session.endSession();
    }

    let meta={  id: song_id }
    let data= await songCollection.findOne({'_id':song_id});
    
    return res.send(commonResponse(200,'Updated successfully',meta,data));
}


/**
 * Delete a song from the artist studio
 * @param {ObjectId} id- song id
 * @param {ObjectId} artist_id - artist id
 * @param {ObjectId} album_id - album id
 * 
 * @returns
 */
const deleteSong = async (req,res)=>{

    let req_body= req.body;
    let id= mongodb.ObjectId(req_body.id);
    let artist_id= mongodb.ObjectId(req_body.artist_id);
    let album_id= req_body.album_id == 'studio' ? 'studio' : mongodb.ObjectId(req_body.album_id);

    let song= await songCollection.findOne({'_id':id});
    //check it the song exists and is the given album correct
    if(!song || song.album._id.toString() != album_id){
        return res.send(commonErrorResponse(400,'The specified song does not exist'));
    }

    
    let session= mongoClient.startSession();

    try{
        await session.withTransaction(async ()=>{

            let artist= await artistCollection.findOne({'_id':artist_id});
            let isRecentSong= false;

            artist.recent_released_songs.map(element=>{
                if(element._id.toString() === id.toString()){
                    isRecentSong=true;
                }
            });

            let artist_col_identifer={
                '_id':artist_id
            }
            let artist_col_operator={
                '$inc':{ 'albums.$[album].num_song':-1 }
            }
            let artist_col_arrayFilter=[{'album._id': album_id }];

            if(isRecentSong){
                artist_col_operator['$pull']={ 'recent_released_songs':{'_id':id} }
            }

            let artist_col= await artistCollection.updateOne(artist_col_identifer,artist_col_operator,{arrayFilters:artist_col_arrayFilter});
            let songs_col=await songCollection.deleteOne({'_id':id});


        })
    }
    catch(error){
        if(error){
            return res.send(commonErrorResponse(400,'Deleting song fails'))
        }
    }
    finally{
        session.endSession();
    }

    let meta={
        id: id
    }
    
    return res.send(commonResponse(200,'Deleted song successfully',meta));
}


/**
 * 
 * @param {ObjectId} id - artist id
 * 
 * @returns
 */
const getListOfSongs= async (req,res)=>{

    let artist_id = mongodb.ObjectId(req.body.id);

    let artist_songs= await songCollection.find({'artist._id':artist_id});
    artist_songs= await artist_songs.toArray();

    let meta={
        total: artist_songs.length,
        artist_id: artist_id
    }
    

    return res.send(commonResponse(200,'Loaded artist songs successfully',meta,artist_songs));
}


module.exports={
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getListOfAlbums,
    getSongsofAlbum,
    uploadSong,
    updateSong,
    deleteSong,
    getListOfSongs
}