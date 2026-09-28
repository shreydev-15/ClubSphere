const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connected succussfully")
    })
    .catch((err)=>{
        console.log("Error in connecting to Database", err)
    })

}

module.exports = connectDB