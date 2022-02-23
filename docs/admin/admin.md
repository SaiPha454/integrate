# Admin endpoints (admin)

## Route - /admin/artists/register
+ ### Description
  - confirm the account request of the artist
+ ### Method - Post
+ ### Params
  -  id - artist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account is registered successfully",
        meta:{
            id: 123456
        },
        data:{
            _id:  123456,
            artist_name: "artist name",
            email:  "artist email",
            status: "active",
            registered: true
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to register account"
        }
     ```

## Route - /admin/artists/activate
+ ### Description
  - activate the artist account
+ ### Method - Post
+ ### Params
  -  id - artist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account is activate",
        meta:{
            id: 123456
        },
        data:{
            _id:  123456,
            artist_name: "artist name",
            email:  "artist email",
            status: "active"
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to activate account"
        }
     ```

## Route - /admin/artists/burn
+ ### Description
  - burn the artist account
+ ### Method - Post
+ ### Params
  -  id - artist id (required)

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account is burned",
        meta:{
            id: 123456
        },
        data:{
            _id:  123456,
            artist_name: "artist name",
            email:  "artist email",
            status: "burn"
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to burn account"
        }
    ```

## Route - /admin/artists
+ ### Description
  - get the list of artists
+ ### Method - Post
+ ### Params
  -  no parameters

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "artists loaded successfully",
        meta:{
            total: 10000
        },
        data:[
                {
                    _id:  123456,
                    artist_name: "artist name",
                    email:  "artist email",
                    status: "active"
                },
                {
                    _id:  13456,
                    artist_name: "artist name",
                    email:  "artist email",
                    status: "burn"
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
            message: "unable to load artists"
        }
    ```

## Route - /artists/account/request
+ ### Description
  - request an account creation to the administration team
+ ### Method - Post
+ ### Params
  - name - artist name (required)
  - email - artist email (required)
  - password - hashed password (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account request is sent successfully"
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to request account"
        }
     ```

## Route - /admin/account/login
+ ### Description
  - login to admin account
+ ### Method - Post
+ ### Params
  - email - admin email (required)
  - password -  password (required)
  
+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "login successfully",
        meta:{
            id: 123456
        },
        data:{
            _id:  123456,
            name: "admin name",
            email:  "admin email"
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to login account"
        }
     ```