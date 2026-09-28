require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB()


app.listen('4212', ()=>{
    console.log("App is listening on port 4212")
})