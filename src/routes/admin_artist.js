const express= require('express');
const adminController = require('../src/controllers/admin/adminController');

const router = express.Router();


router.post('/artists/register',adminController.register)

module.exports= router;