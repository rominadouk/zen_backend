//imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken')

require('dotenv').config();


//middleware
app.use(express.json());
app.use(cors());

 //Load MongoDB URI
const URI = process.env.MONGODB
const SECRET = process.env.SECRETKEY

//models
const Emotion = require('../models/emotionSchema');
const Journal = require('../models/journalSchema')
const User = require('../models/usersSchema.js')

//Routes

//GET JOURNALS
app.get('/journals/:id', async (req, res) => {
    try { 
        const oneJournal = await Journal.findById();
    } catch (err) {
        console.log(err)
    }
})
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
    const deletedEmotion = await Emotion.findByIdAndRemove(req.params.id);
    res.json(deletedEmotion)
    } catch (err) {
        console.log(err)
    }
});

//DELETE JOURNAL
app.delete('/journals/:id', async (req, res) => {
    try {
        const deletedJournal = await Journal.findByIdAndRemove(req.params.id)
        res.json(deletedJournal)
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
app.put('/updatepost/:id', async (req, res) => {
    try {
        const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedJournal)
    } catch (err) {
        console.log(err)
    }
});


//////////////////////////
//USER AUTHENTICATION
/////////////////////////
app.post('/api/register', async (req, res) => {
        console.log(req.body)
        try {
            const user = await User.create(req.body)
            res.json({ status: 'ok'})
        } catch (err) {
            console.log(err)
            res.json({ status: 'error' })
        }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign(
            {
            name: user.name,
            email: user.email

        }, SECRET)
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false})
    }
})



// app.get('/api/login', async (req, res) => {
//     const token = req.headers['x-access-token']

//     try {
//         const decoded = jwt.verify(token, SECRET)
//         const email = decoded.email
//     } catch(err) {
//         console.log(err)
//         res.json({ status: 'error: invalid token'})
//     }
// })

mongoose.connect(URI)
mongoose.connection.once('open', () => {
    console.log('connection to mongoDB established.')
});


app.listen(4000, () => {
    console.log('listening...')
});