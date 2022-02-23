
const adminImple= require('../../imple/admin/admin_artists_imple');

const insert= async (id)=> adminImple.insert(id);

const findById= async (id)=> adminImple.findById(id)

module.exports={
    insert,
    findById
}