const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    username: { type: String, unique: true, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    quote: {type: String}
},
{ collection: 'user-data'}

);
const User = mongoose.model('User', userSchema)
module.exports = User