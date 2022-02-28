
const adminImple= require('../../imple/admin/admin_artists_imple');

/**
 * Confirm the artist account registeration request
 * @param {ObjectId} id - artist id 
 * 
 * @returns
 */
const insert= async (id)=> adminImple.insert(id);

/**
 * Get the artist account details by id
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const findById= async (id)=> adminImple.findById(id)

/**
 * Activate the artist account
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const activate= async (id)=> adminImple.activate(id)

/**
 * Burn the artist account
 * @param {ObjectId} id - artist id
 * 
 * @returns 
 */
const burn = async (id)=> adminImple.burn(id)

/**
 * Get the list of all artists
 * 
 * @returns
 */
const findAll = async ()=> adminImple.findAll()

module.exports={
    insert,
    findById,
    activate,
    burn,
    findAll
}