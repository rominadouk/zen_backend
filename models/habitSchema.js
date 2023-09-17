const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
    {
        name: {type:String, required: true},
        frequency: String,
        reminder: String,
        notes: String
    }, {timestamps:true}
);

const Habit = mongoose.model('Habit', habitSchema)
module.exports = Habit