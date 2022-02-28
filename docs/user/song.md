# Song endpoints (user)

## Route - /users/song/add-to-fav
+ ### Description
  - add a song to my favourite playlist
+ ### Method - Post
+ ### Params
  - id - song id (required)
  - user_id - user id (required)
  - playlist_id - playlist id (option, "fav" is defualt)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "added to playlist successfully",
        meta:{
          id: ObjectID()
        },
        data:{
            
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
            message: "unable to add to playlist"
        }
     ```

## Route - /song/like
+ ### Description
  - give like reaction to a song
+ ### Method - Post
+ ### Params
  - id - song id (required)
  - user_id - user id (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "like  successfully",
    }
    ```

## Route - /song/dislike
+ ### Description
  - give dislike reaction to a song
+ ### Method - Post
+ ### Params
  - id - song id (required)
  - user_id - user id (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "dislike  successfully",
    }
    ```

## Route - /song/download
+ ### Description
  - download a song
+ ### Method - Post
+ ### Params
  - id - song id (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "download  successfully",
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "downloading fail"
        }
     ```

## Route - /subscribe
+ ### Description
  - subscribe to an artist's studio
+ ### Method - Post
+ ### Params
  - id - artist id (required)
  - user_id - user id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "subscribe  successfully",
        meta:{
          id: 123456 //artist id
        },
        data:{
          _id: 123456,
          name: "artist name"
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to subscribe"
        }
     ```

## Route - /artists/id/studio
+ ### Description
  - get the artist's  studio conents
+ ### Method - Get
+ ### Params
  - id - artist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "success",
        meta:{
          id: 123456 //artist id
        },
        data:{
          _id:  ObjectID(),
          name:  "artist name",
          num_songs: 25,
          albums:  [
            {
              id: "album ObjectID()",
              name: "studio",
              num_song: 0
            },
            {
              id: "album ObjectID()",
              name: "album name",
              num_song: 9
            },
            ...
          ],
          recent_released_songs: [
            {
          
                _id:    ObjectID(),
                title:    "song title",
                mp3_file:  "mp3 file path",
                released_date:  "date",
                like:  100,
                dislike:  2,
                artist:  {
                    id: "artist objectID()",
                    name:  "artist name"
                },
                album:  {
                
                    id: "album ObjectID()",
                    name: "album name"
                }       
            },
            ... + 11
          ]
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "no artist studio"
        }
     ```

## Route - /artists/id/albums/album-id
+ ### Description
  - get the artist's  studio conents of an album
+ ### Method - Get
+ ### Params
  - id - artist id (required)
  - album_id - album id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "success",
        meta:{
          id: 123456, //artist id
          album_id: 123, //album id
          total: 10
        },
        data:[

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
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "no contents for this album"
        }
     ```

## Route - /search?query=example
+ ### Description
  - search for songs or artists
+ ### Method - Get
+ ### Params
  - query - search query text (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "success",
        meta:{
          total: 30
        },
        data:{
           artists:[
              {
                _id: ObjectID(),
                name: "artist name"
              },
              ...
           ],
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
            message: "error"
        }
     ```

## Route - /search/suggest?query=example
+ ### Description
  - real time search suggestion for songs or artists
+ ### Method - Get
+ ### Params
  - query - search query text (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "success",
        meta:{
          query: "query words"
        },
        data:{
          suggestions:[
            "cherry sky",
            "taylor",
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
            message: "error"
        }
     ```