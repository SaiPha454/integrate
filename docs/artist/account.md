# Account endpoints (artist)

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

## Route - /artists/account/login
+ ### Description
  - login to artist account
+ ### Method - Post
+ ### Params
  - email - artist email (required)
  - password - hashed password (required)
  
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
            artist_name: "artist name",
            email:  "artist email"
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


## Route - /artists/account/update
+ ### Description
  - update account information
+ ### Method - Put
+ ### Params
  - id - artist id (required)
  - name - artist name (option)
  - email - artist email (option)
  - password - new password (option)
  

+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "account updated successfully",
        meta:{
            id: 123456
        },
        data:{

            _id:  123456,
            artist_name: "artist name",
            email:  "artist email"
        }
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "unable to update account"
        }
     ```

## Route - /artists/account/req-reset-password
+ ### Description
  - request reset account password
+ ### Method - Post
+ ### Params
  - email - artist email (required)
  
+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "reset code is sent"
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "no related email"
        }
     ```

## Route - /artists/account/reset-password
+ ### Description
  - reset account password
+ ### Method - Post
+ ### Params
  - email - artist email (required)
  - password - new password sent by server (required)
  
+ ### Return
    <br/>

    ``` json
    {
        status: 200,
        message: "password is reset successfully"
    }
    ```
+ ### Error
    <br/>
     
     ```json
        {
            status: 401,
            message: "wrong password"
        }
     ```
