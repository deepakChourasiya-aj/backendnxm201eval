const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:["customer","manager"],default:"customer"}
})

const UserModel = mongoose.model('userdata',userSchema)

module.exports = {
    UserModel
}