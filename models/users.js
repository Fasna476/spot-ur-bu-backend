const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    usertype: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user', 
    }
} )

const usersModel = mongoose.model("users",usersSchema)

module.exports = usersModel

