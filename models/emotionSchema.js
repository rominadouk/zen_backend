const mongoose = require('mongoose')
const emotionSchema = new mongoose.Schema(
    {
        name: String,
        category: String,

    }
)

const Emotion = mongoose.model('Emotion', emotionSchema)
module.exports = Emotion