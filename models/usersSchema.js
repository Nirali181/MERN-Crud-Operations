const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error("Email is not valid")
            }
        }
    },
    mobile:{
        type:String,
        required:true,
        minlength: 10,
        maxlength: 10,
    },
    gender:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    profile: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    datecreated:Date,
    dateupdated:Date
})

const users = mongoose.model("users",usersSchema);
module.exports = users