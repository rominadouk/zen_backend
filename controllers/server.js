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

// GET EMOTIONS
app.get('/emotions', async (req, res) => {
    try {
    const allEmotions = await Emotion.find({});
    res.json(allEmotions) 
    } catch (err) {
        console.log(err)
    }
});

//GET JOURNALS
app.get('/journals', async (req,res) => {
    try {
        const allJournals = await Journal.find({});
        res.json(allJournals)
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
app.put('/emotions/:id', async (req, res)=> {
    try {
        const updatedEmotion = await Emotion.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedEmotion)
    } catch (err) {
        console.log(err)
    }
});

//UPDATE JOURNAL
app.put('/journals/:id', async (req, res) => {
    try {
        const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, {new:true});
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