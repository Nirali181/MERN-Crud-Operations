const mongoose = require("mongoose");
require("dotenv").config();

const base_url = process.env.DATABASE_URL
mongoose.connect(base_url).then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>{
    console.log("error",error)
})