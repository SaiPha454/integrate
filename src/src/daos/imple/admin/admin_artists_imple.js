
const mongodb= require('mongodb')
const mongoClient= require('../clients/mongodb_client')

let artistListCollection= mongoClient.db('integrate').collection('artist-list');
/**
 * Confirm the artist account registeration request
 * @param {ObjectId} id - artist id 
 * 
 * @returns
 */
const insert= async (id)=> {

    let artist_id = mongodb.ObjectId(id);

    let identifier= {
        '_id':artist_id
    }
    let operator={
        '$set':{
            'registered':true
        }
    }

    return await artistListCollection.updateOne(identifier,operator);
}

/**
 * Get the artist account details by id
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const findById= async (id)=>{
    let artist_id= mongodb.ObjectId(id);

    return await artistListCollection.findOne({'_id':artist_id},{projection:{'password':0}});

}

module.exports={
    insert,
    findById
}