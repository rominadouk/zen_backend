//imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


//middleware
app.use(express.json());
app.use(cors());

 //Load MongoDB URI
const URI = process.env.MONGODB

//models
const Emotion = require('../models/emotionSchema');
const Journal = require('../models/journalSchema')

//Routes

// GET EMOTIONS AND JOURNALS
app.get('/', async (req, res) => {
    try {
    const allData = await Emotion.find({}) && Journal.find({})
    res.json(allData)
    } catch (err) {
    console.log(err)
    }
});

//CREATE EMOTION
app.post('/emotions', async (req, res)=> {
    try {
        const createdEmotion = await Emotion.create(req.body)
        res.json(createdEmotion)
    } catch (err) {
        console.log(err)
    }
});

//CREATE JOURNAL
app.post('/journals', async (req, res) => {
    try {
        const createdJournal = await Journal.create(req.body)
        res.json(createdJournal)
    } catch (err) {
        console.log(err)
    }
});

//DELETE EMOTION
app.delete('/emotions/:id', async (req, res) => {
    try {
    const deletedEmotion = await Emotion.findByIdAndRemove(req.params.id, req.body);
    res.json(deletedEmotion)
    } catch (err) {
        console.log(err)
    }
});

//DELETE JOURNAL
app.delete('/journals/:id', async (req, res) => {
    try {
        const deletedJournal = Journal.findByIdAndRemove(req.params.id, req.body);
    } catch (err) {
        console.log(err)
    }
});

//UPDATE EMOTION
app.put('/emotion/:id', async (req, res)=> {
    try {
        const updatedEmotion = await Emotion.findByIdAndUpdate(req.params.id, req.body, {new:true});
    } catch (err) {
        console.log(err)
    }
});

//UPDATE JOURNAL
app.put('/journals/:id', async (req, res) => {
    try {
        const updatedJournal = Journal.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedJournal)
    } catch (err) {
        console.log(err)
    }
});

mongoose.connect(URI)
mongoose.connection.once('open', () => {
    console.log('connection to mongoDB established.')
});


app.listen(4000, () => {
    console.log('listening...')
});