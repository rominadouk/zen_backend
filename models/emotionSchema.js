const mongoose = require('mongoose')
const emotionSchema = new mongoose.Schema(
    {
        name: String,
        color: String,
        instances: Number

    }
)

const Emotion = mongoose.model('Emotion', emotionSchema)
module.exports = Emotion