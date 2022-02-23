
const adminImple= require('../../imple/admin/admin_artists_imple');

const insert= async (id)=> adminImple.insert(id);

const findById= async (id)=> adminImple.findById(id)

const activate= async (id)=> adminImple.activate(id)

const burn = async (id)=> adminImple.burn(id)

const findAll = async ()=> adminImple.findAll()

module.exports={
    insert,
    findById,
    activate,
    burn,
    findAll
}