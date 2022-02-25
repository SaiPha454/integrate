const express= require('express');
const userController = require('../src/controllers/users/userController');

const router = express.Router();

router.post('/song/add-to-fav',userController.addToFav);
router.post('/song/like',userController.likeSong);


module.exports= router;