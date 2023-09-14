const express = require("express");
const app = express();
require("dotenv").config();
require("./db/connection");
const cors = require("cors");
const router = require("./routes/router")
port = process.env.PORT
 app.use(express.json());
app.use(cors());
app.use(router);
app.use("/uploads",express.static("./uploads"));
app.use("/files",express.static("./public/files"));

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})