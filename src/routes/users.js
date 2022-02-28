const express= require('express');
const userController = require('../src/controllers/users/userController');

const router = express.Router();

router.post('/song/add-to-fav',userController.addToFav);
router.post('/song/like',userController.likeSong);
router.post('/song/dislike',userController.dislikeSong);
router.get('/artists/:id/studio',userController.getArtistStudio);
router.get('/artists/:id/albums/:album_id',userController.getArtistAlbum);
router.get('/search',userController.search);
router.post('/search/suggest',userController.searchSuggest);

module.exports= router;