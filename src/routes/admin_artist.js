const express= require('express');
const adminController = require('../src/controllers/admin/adminController');

const router = express.Router();


router.post('/artists/register',adminController.register)
router.post('/artists/activate',adminController.activateArtistAccount)
router.post('/artists/burn',adminController.burnArtistAccount)

module.exports= router;