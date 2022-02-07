# Album endpoints (artist)

## Route - /artists/albums/create
+ ### Description
  - create an album by an artist
+ ### Method - Post
+ ### Params
  - name - album name (required)
  - artist_id - atist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 201,
        message: "album created successfully",
        meta:{
            album_id: 123,
            artist_id: 123456,
        },
        data: {
            id: 123,
            name: "album name",
            num-song: 0
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to create album"
        }
     ```

## Route - /artists/albums/update
+ ### Description
  - update the album name specified by id
+ ### Method - PUT
+ ### Params
  - id - album id (required)
  - artist-id - atist id (required)
  - name - new album name (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "album updated successfully",
        meta:{
            album_id: 123,
            artist_id: 123456
        },
        data: {
            id: 123,
            name: "updated album name",
            num-song: 25
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to update album"
        }
     ```

## Route - /artists/albums/delete
+ ### Description
  - delete an album with a specified id
+ ### Method - Delete
+ ### Params
  - id - album id (required)
  - artist-id - atist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "album deleted successfully"
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to delete album"
        }
     ```

## Route - /artists/albums
+ ### Description
  - get the list of albums of an artist
+ ### Method - Post
+ ### Params
  - artist-id - atist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "albums loaded successfully",
        meta:{
            artist_id: 123456,
            total: 10
        },
        data: {
            albums: [
                {
                    id : 1287945,
                    name: "album name",
                    num_song : 9
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
            message: "unable to load albums"
        }
     ```

## Route - /artists/albums/songs
+ ### Description
  - get the list of songs of an artist's album
+ ### Method - Post
+ ### Params
  - id - album id (required)
  - artist-id - atist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "album's songs loaded successfully",
        meta:{
            album_id: 123,
            artist_id: 123456
        },
        data: {
            songs: [
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
            message: "unable to load album's songs"
        }
     ```


