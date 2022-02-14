//config the env variables
require('dotenv').config()

const app = require('./routes/index');

let port = process.env.port;


app.listen(port , ()=>{
    console.log(`Server is running on port ${port} `)
})