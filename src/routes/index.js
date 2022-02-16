
const express = require('express');
const artistAlbunRouter = require('./artist_album');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/artists/albums',artistAlbunRouter)

module.exports = app;