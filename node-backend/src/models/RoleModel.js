//database
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    //fileds /// get
    name:{
        type:String,
        required: true, 
        unique: true,
        uppercase: true   
    },
    description:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model("roles",roleSchema);

//roles[roleSchema]