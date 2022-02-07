
const app = require('./routes/index');

let port = 4200;


app.listen(port , ()=>{
    console.log(`Server is running on port ${port} `)
})