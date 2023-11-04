const mongoose = require('mongoose')

const journalSchema = new mongoose.Schema (
    {
        title: {type:String, required: true},
        post: String,
        tags: [String]
    }, {timestamps:true}
)
const Journal = mongoose.model('Journal', journalSchema)
module.exports = Journal