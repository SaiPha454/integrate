
const express= require('express');
const artistController = require('../src/controllers/artists/artistController');

const router = express.Router();


router.post('/create',artistController.uploadSong)
router.put('/update',artistController.updateSong)
router.delete('/delete',artistController.deleteSong)
router.post('/songs',artistController.getListOfSongs)

module.exports= router;