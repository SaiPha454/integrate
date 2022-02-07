# Account endpoints (user)

## Route - /users/signup
+ ### Description
  - sign up a user account
+ ### Method - Post
+ ### Params
  - name - user name (required)
  - email - user email (required)
  - password -  password (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account is created successfully",
        meta:{
            id: 123456
        },
        data:{
            _id: ObjectID(),
            name: "user name",
            email: "user email",
            subscribes:[],
            playlists:[]
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to create account"
        }
     ```

## Route - /users/login
+ ### Description
  - login to user account
+ ### Method - Post
+ ### Params
  - email - user email (required)
  - password -  password (required)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account login successfully",
        meta:{
            id: 123456
        },
        data:{
            _id: ObjectID(),
            name: "user name",
            email: "user email",
            subscribes:[...],
            playlists:[...]
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