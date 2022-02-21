
const express= require('express');
const artistController = require('../src/controllers/artists/artistController');

const router = express.Router();


router.post('/create',artistController.createAlbum)
router.post('/update',artistController.updateAlbum)
router.delete('/delete',artistController.deleteAlbum)
router.post('/',artistController.getListOfAlbums)
router.post('/songs',artistController.getSongsofAlbum)

module.exports= router;