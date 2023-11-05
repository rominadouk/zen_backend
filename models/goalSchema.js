const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
    {
        title: {type:String, required: true},
        toBeCompletedBy: Date, 
        isCompleted: {type: Boolean, default: false}
    }
);

const Goal = mongoose.model('Goal', goalSchema)
module.exports = Goal