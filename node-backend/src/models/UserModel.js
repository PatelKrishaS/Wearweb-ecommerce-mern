const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    name:{
        type:String,
    },
    age:{
        type:Number,
        min: 1
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    profilePicture: {
        type: String, 
        default: "default-profile.png" // Placeholder for users without a profile picture
    },
    status:{
        type:Boolean,
        default:true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles",
        required: true,
        default: "67c6afff789c928be79e7426"
    },
    password: {
        type:String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required: true,
    }

},{ timestamps: true })

module.exports = mongoose.model("users",userSchema)