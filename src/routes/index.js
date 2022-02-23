
const express = require('express');
const artistAlbunRouter = require('./artist_album');
const artistSongRouter = require('./artist_song')
const adminRouter= require('./admin_artist')
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/artists/albums',artistAlbunRouter)
app.use('/artists/songs',artistSongRouter)
app.use('/admin',adminRouter)

module.exports = app;