# Songs endpoints (artist)

## Route - /artists/songs/create
+ ### Description
  - upload a song
+ ### Method - Post
+ ### Params
  - title - song name (required)
  - mp3_file - mp3 file path (required)
  - artist_id - artist id (required)
  - artist_name - artist name (required)
  - album_id - album id (option , if album is not specified     'studio' album name is used instead)
  - album_name - album name (option)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 201,
        message: "song uploaded successfully",
        meta:{
            song_id: 12
            album_id: 123,
            artist_id: 123456
        },
        data: {
            _id:    ObjectID(),
            title:    "song title",
            mp3_file:  "mp3 file path",
            released_date:  "date",
            artist:  {
                id: "artist objectID()",
                name:  "artist name"
            },
            album:  {
            
                id: "album ObjectID()",
                name: "album name"
            } 
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to upload song"
        }
     ```

## Route - /artists/songs/update
+ ### Description
  - update a song informations such as title, album.
+ ### Method - Put
+ ### Params
  - id - song id (required)
  - artist_id - artist id (required)
  - title - song name (option)
  - album_id - album id (option)
  - album_name - album name (option)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "song updated successfully",
        meta:{
            song_id: 12
            album_id: 123,
            artist_id: 123456
        },
        data: {
            _id:    ObjectID(),
            title:    "song title",
            mp3_file:  "mp3 file path",
            released_date:  "date",
            artist:  {
                id: "artist objectID()",
                name:  "artist name"
            },
            album:  {
            
                id: "album ObjectID()",
                name: "album name"
            } 
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to update song"
        }
     ```


## Route - /artists/songs/delete
+ ### Description
  - delete a song
+ ### Method - Delete
+ ### Params
  - id - song id (required)
  - artist_id - artist id (required)
  - album_id - album id (required)
  
+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "song deleted successfully",
        meta:{
            song_id: 12
            album_id: 123,
            artist_id: 123456
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to delete song"
        }
     ```

## Route - /artists/songs
+ ### Description
  - get a list of songs of the artist
+ ### Method - Post
+ ### Params
  - id - artist id (required)
  
+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "songs loaded successfully",
        meta:{
            total: 25,
            artist_id: 123456
        },
        data: {
            songs:[
                {
                    _id:    ObjectID(),
                    title:    "song title",
                    mp3_file:  "mp3 file path",
                    released_date:  "date",
                    artist:  {
                        id: "artist objectID()",
                        name:  "artist name"
                    },
                    album:  {
                    
                        id: "album ObjectID()",
                        name: "album name"
                    } 
                },
                ...
            ]
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to load songs"
        }
     ```